import * as React from 'react';
import Spreadsheet from 'react-spreadsheet';

export interface IHelloWorldProps {
  initialData: { value: string }[][];
  Year: string;
  onCopy: boolean;
  OnSave: boolean;
  onDataChange: (data: string) => void;
  FiscelYear: boolean;
  SubAccountsID: string[];
}

export const HelloWorld: React.FC<IHelloWorldProps> = ({
  initialData,
  Year,
  onCopy,
  OnSave,
  onDataChange,
  SubAccountsID,
  FiscelYear
}) => {
  const [data, setData] = React.useState(initialData);
  const [jsonData, setJsonData] = React.useState<{ [key: string]: string }[]>();

  const NextYear = 1 + Number(Year);

  const ColumnLabels = FiscelYear
    ? ["Number", "Name", "Description", "10/" + Year, "11/" + Year, "12/" + Year, "01/" + NextYear, "02/" + NextYear, "03/" + NextYear, "04/" + NextYear, "05/" + NextYear, "06/" + NextYear, "07/" + NextYear, "08/" + NextYear, "09/" + NextYear]
    : ["Number", "Name", "Description", "01/" + Year, "02/" + Year, "03/" + Year, "04/" + Year, "05/" + Year, "06/" + Year, "07/" + Year, "08/" + Year, "09/" + Year, "10/" + Year, "11/" + Year, "12/" + Year];

  // eslint-disable-next-line
  const handleChange = React.useCallback(
    (newData: any) => {
      let isValid = true;
      for (let i = 0; i < newData.length; i++) {


          if (newData[i][2].value === "*Main Account*") {
            // If pasting, allow the row but make it non-editable
            if (data[i] && data[i][2].value === "*Main Account*") {
              // Allow pasting but prevent further edits
              newData[i] = data[i];
            } else {
              // Prevent empty rows from being pasted
              const isEmptyRow = newData[i].every((cell: { value: string; }) => cell.value === '');
              if (isEmptyRow) {
                newData[i] = data[i]; // Restore the old data if the row is empty
                continue; // Skip to the next row
              }
            }
          }
  

        for (let j = 3; j < newData[i].length; j++) {
          const cell = newData[i][j] || { value: '0' };
          const value = cell.value || "0";

          if (/^[a-zA-Z]/.test(value)) {
            newData[i][j] = { value: '' }; // Clear the cell if it starts with an alphabet
            isValid = false;
          } else if (/[a-zA-Z]/.test(value)) {
            const index = value.search(/[a-zA-Z]/);
            const numericPart = value.slice(0, index); // Extract the numeric part
            newData[i][j] = { value: numericPart }; // Keep the numeric part
            isValid = false;
          }
        }
      }

      setData(newData);
      console.log(newData);
    },
    [setData]
  );

  // Update jsonData and notify parent component when OnSave or data changes
  React.useEffect(() => {
    const sanitizedData = data.map(row => row.map(cell => (cell ? { value: cell.value || '' } : { value: '' })));
    const Fixed = FiscelYear ? ["Number", "Name", "Description", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "_ID"]
                             : ["Number", "Name", "Description", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "_ID"];
    const jsonData = sanitizedData.map((row, rowIndex) => {
      const rowObject: { [key: string]: string } = {};
      row.forEach((cell, index) => {
        rowObject[Fixed[index]] = cell.value;
      });
      rowObject["_ID"] = SubAccountsID[rowIndex];
      return rowObject;
    });

    setJsonData(jsonData);
    onDataChange(JSON.stringify(jsonData));
    console.log(JSON.stringify(jsonData), "this should update");
  }, [OnSave]);

  // Handle copy to clipboard
React.useEffect(()=>{
    const sanitizedData = data.map(row => row.map(cell => cell.value).join('\t')).join('\n');
    navigator.clipboard.writeText(sanitizedData)
      .then(() => console.log('Data copied to clipboard'))
      .catch(err => console.error('Error copying data: ', err));
  },[onCopy]);

  // Handle add row
  const handleAddRow = () => {
    const newRow = Array(data[0].length).fill({ value: '' });
    setData(prevData => [...prevData, newRow]);
  };

  // Handle delete row
  const handleDeleteRow = (rowIndex: number) => {
    if (data.length > 1) {
      setData(prevData => [...prevData.slice(0, rowIndex), ...prevData.slice(rowIndex + 1)]);
    }
  };

  return (
    <div style={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginBottom: '10px', marginTop: '10px', marginLeft: '1px', marginRight: '1px' }}>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={handleAddRow}>Add Row</button>
        <button onClick={() => handleDeleteRow(data.length - 1)}>Delete Last Row</button>
        {/* <button onClick={handleCopy}>Copy Data</button> */}
      </div>
      <div style={{ height: '100%', width: '100%', overflow: 'auto' }}>
        <Spreadsheet
          data={data}
          columnLabels={ColumnLabels}
          onChange={handleChange}
        />
      </div>
      Version 1.2.0
    </div>
  );
};
