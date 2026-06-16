import { test, expect } from '@playwright/test';
import fetch from 'node-fetch';

const MOKAPI_API = 'http://localhost:8080/api/services/kafka/Kafka%20Mock';
const TOPIC_COMMAND = 'document.send-command';
const TOPIC_EVENT = 'document.send-event';

test('Kafka document send workflow', async () => {
    const documentId = 'doc-' + Date.now();
    let startOffset = -1
    console.log('using document ID: ' + documentId)

    await test.step('Get current offset for events', async () => {
        startOffset = await getPartitionOffset(TOPIC_EVENT, 0)
        console.log('current partition offset is: ' + startOffset)
    })

    await test.step('Produce a message to document.send-command topic', async () => {
        await produce(TOPIC_COMMAND, {
            key: documentId,
            value: {
                documentId: documentId,
                recipient: 'alice@mokapi.io',
                document: {
                    mediaType: 'text/plain',
                    fileName: 'test.txt',
                    content: 'Hello Alice'
                }
            }
        })
    })

    await test.step('Get messages from document.send-event', async () => {
        let record: any = undefined;
        const timeout = Date.now() + 5000;

        while (Date.now() < timeout && !record) {
            const records: any = await read(TOPIC_EVENT, 0, startOffset);
            console.log('The record is: ')
            console.log(records)
            record = records.find((x:any) => x.value.documentId === documentId);
            if (record) {
                break
            }
            startOffset += records.length
            // short delay before retry
            await new Promise(res => setTimeout(res, 200));
        }
        expect(record, 'record should be found').not.toBeNull();
        expect(record.value.status).toBe('SENT')
    })
})

async function getPartitionOffset(topic: string, partition: number) {
    const res = await fetch(`${MOKAPI_API}/topics/${topic}/partitions/${partition}`);
    const data: any = await res.json();
    return data.offset
}

async function produce(topic: string, record: {key: string, value: any}) {
    const res = await fetch(`${MOKAPI_API}/topics/${topic}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            records: [
                {
                    key: record.key,
                    value: record.value
                }
            ]
        })
    });
    expect(res.status).toBe(200);
    const data: any = await res.json();
    expect(data.offsets.every((x: any) => !('error' in x))).toBe(true);
}

async function read(topic: string, partition: number, offset: number) {
    const res = await fetch(`${MOKAPI_API}/topics/${topic}/partitions/${partition}/offsets?offset=${offset}`,
        {
            headers: { Accept: 'application/json' }
        }
    )

    expect(res.status).toBe(200);
    return await res.json()
}