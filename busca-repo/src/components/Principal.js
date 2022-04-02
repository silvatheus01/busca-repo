import TextField from "@mui/material/TextField";
import { TableCell,TableRow,Table,TableHead, Button, TableBody } from '@mui/material';

import {Component} from 'react';


const { Octokit } = require("@octokit/core");


class Principal extends Component{
    constructor(props){
        super(props)
        this.state = {
            itens: [],
            termo: '',
            showTable: false,
        };
    }
    
    componentDidMount() {         
    
    }
    
    renderTable = () => {
        if(this.state.showTable === false){
            return <h1>Pesquise por algum termo</h1>
        }else{              
            
            return(
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
            );
        }
    }

    handleOnClick(){

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


        let getResponse = async (termo) => {
            return await octokit.request('GET /search/repositories', {
                q: termo + ' in:name,description,readme',
                page: 1,
            })
        }
    
        getResponse(this.state.termo).then((response) => this.setState({
            itens: response.data.items,
            showTable: true,
        }))            
        
    }
    

    render(){
        return(
            <div className='principal'>
                <div className='input'>
                    <TextField onChange={(e) => {this.setState({termo: e.target.value})}} fullWidth id="outlined-basic" label="Pesquise aqui" variant="outlined" />
                </div>
                <div className='botao'>
                    <Button onClick={()=>this.handleOnClick()} variant="contained">Pesquisar</Button>
                </div>
                {this.renderTable()}                
            </div>
        );
    }
}

export default Principal