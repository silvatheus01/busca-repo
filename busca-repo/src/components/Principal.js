import TextField from "@mui/material/TextField";
import { TableCell,TableRow,Table,TableHead, Button, TableBody } from '@mui/material';

import {Component} from 'react';


const { Octokit } = require("@octokit/core");


class Principal extends Component{
    constructor(props){
        super(props)
        this.state = {
            itens: []
        };
    }
    
    componentDidMount() {
        let token;

        fetch("token.txt").then(function(response) {
        return response
        }).then(function(data) {
        token = data.text()
        }).catch(function(err) {
        console.log('Fetch problem show: ' + err.message);
        });

        // Create a personal access token at https://github.com/settings/tokens/new?scopes=repo
        const octokit = new Octokit({ auth: 
        token
        });

        const queryString = encodeURIComponent('programacao+in:name');

        let getResponse = async (queryString) => {
        return await octokit.request('GET /search/repositories', {
            q: '20 in:name,description,readme',
            page: 1,
        })
        }

        getResponse(queryString).then((response) => this.setState({
            itens: response.data.items 
        }))
    
        //console.log(getResponse)

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
    }

    render(){
        return(
            <div className='principal'>
                <div className='input'>
                    <TextField fullWidth id="outlined-basic" label="Pesquise aqui" variant="outlined" />
                </div>
                <div className='botao'>
                    <Button variant="contained">Pesquisar</Button>
                </div>
                
                <div className='resultado'>
                    <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                    <TableHead>
                        <TableRow>
                        <TableCell>Nome do repositório</TableCell>
                        <TableCell align="right">Descrição do Repositório</TableCell>
                        <TableCell align="right">Nome do autor</TableCell>
                        <TableCell align="right">Linguagem do Repositório</TableCell>
                        <TableCell align="right">Número de Stars</TableCell>
                        <TableCell align="right">Número de Forks</TableCell>
                        <TableCell align="right">Data da última atualização</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {this.state.itens.map((row) => (
                        <TableRow key={row.id}>
                            <TableCell component="th" scope="row">
                            {row.name}
                            </TableCell>
                            <TableCell align="right">{row.description}</TableCell>
                            <TableCell align="right">{row.owner.login}</TableCell>
                            <TableCell align="right">{row.language}</TableCell>
                            <TableCell align="right">{row.stargazers_count}</TableCell>
                            <TableCell align="right">{row.forks_count}</TableCell>
                            <TableCell align="right">{row.updated_at}</TableCell>
                        </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                </div>
            </div>
        );
    }
}

export default Principal