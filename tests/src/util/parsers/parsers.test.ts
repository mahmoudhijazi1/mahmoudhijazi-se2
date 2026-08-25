import fs from 'fs/promises';
import { readJSONfile } from '../../../../src/util/parsers/jsonParser';
import { readXMLfile } from '../../../../src/util/parsers/xmlParser';

describe('readJSONfile', () => {
  afterEach(() => {
    jest.restoreAllMocks(); // Restores original fs.readFile behavior after each test
  });

  it('should read and parse JSON data correctly', async () => {
    // 1. Arrange: Fake sample data & mock fs.readFile
    const fakeData = { id: 1, name: 'Sample Item' };
    jest.spyOn(fs, 'readFile').mockResolvedValue(JSON.stringify(fakeData));

    // 2. Act: Run the function
    const result = await readJSONfile<{ id: number; name: string }>('dummy.json');

    // 3. Assert: Check result
    expect(result).toEqual(fakeData);
  });
});

describe('readXMLfile', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should read and parse XML data correctly', async () => {
    // 1. Arrange: Fake XML string & mock fs.readFile
    const fakeXml = `
      <data>
        <row>
          <OrderID>101</OrderID>
          <Type>Action Figure</Type>
        </row>
      </data>
    `;
    jest.spyOn(fs, 'readFile').mockResolvedValue(fakeXml);

    // 2. Act: Run the function
    const result = await readXMLfile<{ data: { row: { OrderID: number; Type: string } } }>('dummy.xml');

    // 3. Assert: Check parsed result
    expect(result.data.row).toEqual({
      OrderID: 101,
      Type: 'Action Figure',
    });
  });
});

it('should throw an error if the file is not found', async () => {
  jest.spyOn(fs, 'readFile').mockRejectedValue(new Error('File not found'));

  await expect(readJSONfile('invalid.json')).rejects.toThrow('File not found');
});

it('should throw an error on malformed JSON', async () => {
  jest.spyOn(fs, 'readFile').mockResolvedValue('{ invalid json }');

  await expect(readJSONfile('corrupt.json')).rejects.toThrow();
});