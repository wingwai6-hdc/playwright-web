import { test as baseTest, expect } from '../fixtures/fixtures';
import { parseMT, validateMTRaw, getMTDefinition, MTBuilder } from '@eklabdev/fix-swift-forge';
import { parseMX, validateMXRaw, getMXDefinition, MXBuilder } from '@eklabdev/fix-swift-forge';
import {attachNetworkCapture} from "postman-playwright";

const test = attachNetworkCapture(baseTest);

test.describe('SWIFT Message Testing', () => {
  test('Validate SWIFT MT (ISO 15022) message', async ({ loginPage }) => {

    const raw = '{1:F01BANKBICAAXXX0000000000}{2:I103BANKBICBBXXXN}{3:{108:MT103}}{4:\r\n:20:REF123456\r\n:23B:CRED\r\n:32A:230101USD1000,00\r\n:50A:John Doe\r\n:59:Jane Smith\r\n:71A:SHA\r\n-}{5:{CHK:ABCDEF123456}}';
    const msg = parseMT(raw);
    const def = getMTDefinition('103');
    const result = validateMTRaw(raw, def);

    await loginPage.goto();

    console.log(msg.type);                // "103"
    console.log(msg.block1.senderLT);     // "BANKBICAAXXX"
    console.log(msg.block2.direction);    // "I"
    console.log(msg.block4[0].tag);       // "20"
    console.log(msg.block4[0].value);     // "REF123456"
    expect(msg.type).toBe('103');

    if (result.valid) {
      console.log('MT103 is valid');
    } else {
      result.errors.forEach((e) => console.error(e.message));
    }
  });

 /* test('Build SWIFT MT (ISO 15022) message', async ({ loginPage }) => {

    const builder = new MTBuilder('103');
    builder
        .setSender('BANKBICAA')
        .setReceiver('BANKBICBB')
        .setField('20', 'REF123456')
        .setField('23B', 'CRED')
        .setField('32A', '230101USD1000,00')
        .setField('50A', 'John Doe')
        .setField('59', 'Jane Smith')
        .setField('71A', 'SHA');

    const rawMT = builder.build();
    console.log(rawMT);
  });*/

  test('Validate SWIFT MX (ISO 20022) message', async ({ loginPage }) => {

    const xml = `<Biz>
  <AppHdr>
    <Fr><FIId><FinInstnId><BICFI>BANKBICAA</BICFI></FinInstnId></FIId></Fr>
    <To><FIId><FinInstnId><BICFI>BANKBICBB</BICFI></FinInstnId></FIId></To>
    <BizMsgIdr>MSG-001</BizMsgIdr>
    <MsgDefIdr>pacs.008.001.08</MsgDefIdr>
    <CreDt>2023-01-01T12:00:00Z</CreDt>
  </AppHdr>
  <Document xmlns="urn:iso:std:iso:20022:tech:xsd:pacs.008.001.08">
    <FIToFICstmrCdtTrf>
      <GrpHdr><MsgId>MSG-001</MsgId><CreDtTm>2023-01-01T12:00:00Z</CreDtTm><NbOfTxs>1</NbOfTxs></GrpHdr>
    </FIToFICstmrCdtTrf>
  </Document>
</Biz>`;

    const msg = parseMX(xml);

    await loginPage.goto();

    console.log(msg.type);             // "pacs.008.001.08"
    console.log(msg.header.from);      // "BANKBICAA"
    console.log(msg.document);         // Nested JSON of Document body

    const def = getMXDefinition('pacs.008.001.10');
    const result = validateMXRaw(xml, def);
    console.log(result.valid);
  });

 /* test('Build SWIFT MX (ISO 20022) message', async ({ loginPage }) => {

    const builder = new MXBuilder('pacs.008.001.08');
    builder
      .setHeader({
        from: 'BANKBICAA',
        to: 'BANKBICBB',
        businessMessageIdentifier: 'MSG-001',
        creationDate: '2023-01-01T12:00:00Z',
      })
      .setElement('GrpHdr.MsgId', 'MSG-001')
      .setElement('GrpHdr.CreDtTm', '2023-01-01T12:00:00Z')
      .setElement('GrpHdr.NbOfTxs', '1');

    const xmlOutput = builder.build();
    console.log(xmlOutput);
  });*/
});