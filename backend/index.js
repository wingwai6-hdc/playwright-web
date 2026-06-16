import { Kafka } from 'kafkajs';

const kafka = new Kafka({
    clientId: 'backend',
    brokers: ['localhost:9092']
});

const consumer = kafka.consumer({ groupId: 'backend-group' });
const producer = kafka.producer();

async function start() {
    await consumer.connect();
    await producer.connect();

    await consumer.subscribe({ topic: 'document.send-command', fromBeginning: true });

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const value = JSON.parse(message.value.toString());
            console.log('Received command:', value);

            // Simulate sending the document
            await new Promise(res => setTimeout(res, 500));

            // Publish send-event
            const event = {
                documentId: value.documentId,
                status: 'SENT'
            };
            await producer.send({
                topic: 'document.send-event',
                messages: [{ key: value.documentId, value: JSON.stringify(event) }]
            });

            console.log('Published event:', event);
        }
    });
}

start().catch(console.error);