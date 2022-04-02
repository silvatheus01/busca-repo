//import logo from './logo.svg';
import './App.css';
import React from 'react';

import TextField from "@mui/material/TextField";
import { DataGrid } from '@mui/x-data-grid';

const { Octokit } = require("@octokit/core");

// Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
const octokit = new Octokit({ auth: "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" });

const queryString = encodeURIComponent('programacao+in:name');

let getResponse = async (queryString) => {
  return await octokit.request('GET /search/repositories', {
    q: '20 in:name,description,readme'
  })
}

getResponse(queryString).then((response) => {console.log(response)});

const rows = [
  { id: 1, col1: 'Hello', col2: 'World' },
  { id: 2, col1: 'DataGridPro', col2: 'is Awesome' },
  { id: 3, col1: 'MUI', col2: 'is Amazing' },
];

const columns = [
  { field: 'col1', headerName: 'Nome do repositório', width: 200 },
  { field: 'col2', headerName: 'Descrição do Repositório', width: 200 },
  { field: 'col3', headerName: 'Descrição do Repositório', width: 200 },
  { field: 'col4', headerName: 'Nome do autor', width: 150 },
  { field: 'col5', headerName: 'Linguagem do Repositório', width: 200 },
  { field: 'col6', headerName: 'Número de Stars', width: 150 },
  { field: 'col7', headerName: 'Número de Forks', width: 150 },
  { field: 'col8', headerName: 'Data da última atualização', width: 200 },
];


function App() {
  return (
    <div className='principal'>
      <div className='input'>
        <TextField fullWidth id="outlined-basic" label="Pesquise aqui" variant="outlined" />
      </div>
      
      <div className='resultado'>
        <DataGrid clasName='resultado' rows={rows} columns={columns} />
      </div>
    </div>
  );
}

export default App;
