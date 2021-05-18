import React, { useState } from 'react';
import './App.css';
import MaterialTable from 'material-table'
import XLSX from 'xlsx'
import { MenuItem, Select } from '@material-ui/core';

const EXTENSIONS = ['xlsx', 'xls', 'csv']
function App() {
  const [colDefs, setColDefs] = useState()
  const [data, setData] = useState()

  const [dropdowns, setDropDowns] = useState([
    {value: '', text: "select one"},
    {value: 'one', text: 1},
    {value: 'two', text: 2},
    {value: 'three', text: 3}

  ])

  const getExention = (file) => {
    const parts = file.name.split('.')
    const extension = parts[parts.length - 1]
    return EXTENSIONS.includes(extension) // return boolean
  }

  const convertToJson = (headers, data) => {
    const rows = []
    data.forEach(row => {
      let rowData = {}
      row.forEach((element, index) => {
        rowData[headers[index]] = element
      })
      rows.push(rowData)

    });
    return rows
  }

 


  const column_defination = (head) =>{
    let type = null
    let lookup = null

    
    
    if(head==='number1' || head==='number2'){
        type='numeric'
        lookup=null
    }
    
  if(head==='largeText2'){
    return { 
      title: head, 
      field: head, 
      type: type, 
      
      editComponent: props=>(<textarea onChange={e => props.onChange(e.target.value)}>{props.value}</textarea>)

      
    }
  }

  if(head==='textDropdown'){
    return { 
      title: head, 
      field: head, 
      type: type, 
      validate: rowData => rowData.textDropdown&&rowData.textDropdown !== '',
      editComponent: props=>(<Select error={props.error} value={props.value} onChange={e => props.onChange(e.target.value)}>
        {dropdowns.map((item)=><MenuItem value={item.value}>{item.text}</MenuItem>)}
      </Select>)

      
    }
  }
    return { 
      title: head, 
      field: head, 
      type: type,
    }
  }
  const importExcel = (e) => {
    const file = e.target.files[0]

    const reader = new FileReader()
    reader.onload = (event) => {
      //parse data

      const bstr = event.target.result
      const workBook = XLSX.read(bstr, { type: "binary" })

      //get first sheet
      const workSheetName = workBook.SheetNames[0]
      const workSheet = workBook.Sheets[workSheetName]
      //convert to array
      const fileData = XLSX.utils.sheet_to_json(workSheet, { header: 1 })
      // console.log(fileData)
      const headers = fileData[0]
      const heads = headers.map(head => (column_defination(head.trim())))
      
      setColDefs(heads)

      //removing header
      fileData.splice(0, 1)


      setData(convertToJson(headers, fileData))
    }

    if (file) {
      if (getExention(file)) {
        reader.readAsBinaryString(file)
      }
      else {
        alert("Invalid file input, Select Excel, CSV file")
      }
    } else {
      setData([])
      setColDefs([])
    }
  }

  return (
    <div className="App">
      <h1 align="center">Reactjs application</h1>
      <h4 align='center'>Import Data from Excel, CSV in Material Table</h4>
      <input type="file" onChange={importExcel} />
      <MaterialTable 
      title="Olympic Data" 
      data={data} 
      columns={colDefs}
      editable={{
        onRowAdd: newData =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    setData([...data, newData]);

                    resolve();
                }, 1000);
            }),
        onRowUpdate: (newData, oldData) =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    const dataUpdate = [...data];
                    const index = oldData.tableData.id;
                    dataUpdate[index] = newData;
                    setData([...dataUpdate]);

                    resolve();
                }, 1000);
            }),
        onRowDelete: oldData =>
            new Promise((resolve, reject) => {
                setTimeout(() => {
                    const dataDelete = [...data];
                    const index = oldData.tableData.id;
                    dataDelete.splice(index, 1);
                    setData([...dataDelete]);

                    resolve();
                }, 1000);
            })
      }} />
    </div>
  );
}

export default App;