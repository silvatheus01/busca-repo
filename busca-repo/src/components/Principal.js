import TextField from "@mui/material/TextField";
import { TableCell,
    TableRow,
    Table,
    TableHead, 
    Button, 
    TableBody, 
    TableFooter, 
    TablePagination,
    TableContainer 
} from '@mui/material';

import {Component} from 'react';
import {StyledTableCell,StyledTableRow} from "./Style"

const axios = require('axios');

// Número maxima de "linhas" que a api pode retornar
const MAX_ROWS = 1000

const DEFAULT_ROWS_PER_PAGE = 10


function getNumRows(numRows){

    if(numRows > MAX_ROWS){
        return MAX_ROWS
    }else{
        return numRows
    }
    
}

function getRowsPerPage(itens){
    return itens.length
}

function getRowsPerPageOptions(numRows){
    if(numRows <= DEFAULT_ROWS_PER_PAGE){
        return [numRows]
    }else{
        if(numRows%DEFAULT_ROWS_PER_PAGE !== 0){
            return [DEFAULT_ROWS_PER_PAGE,numRows%DEFAULT_ROWS_PER_PAGE]
        }else{
            return [DEFAULT_ROWS_PER_PAGE]
        }            
    }
}


class Principal extends Component{
    constructor(props){
        super(props)
        this.state = {
            itens: [],
            termo: '',
            ultimoTermo: '',
            showTable: false,
            atualPag: 0,
            rowsPerPage: DEFAULT_ROWS_PER_PAGE,
            numRows: 0,
        };
    }
    
    componentDidMount() {         
       
    }

    setData = (dados) => {   
       
        var getResponse = async (dados) => {

            let termo, pagina, rowsPerPage

            if(dados.termo === undefined){
                termo = this.state.termo
            }else{
                termo = dados.termo
            }

            if(dados.pagina === undefined){
                pagina = 1
                this.setState({atualPag: 0})
            }else{
                // Soma um por causa da diferenã entre page do octokit e o TablePagination
                pagina = dados.pagina + 1
            }

            if(dados.rowsPerPage === undefined){               
                rowsPerPage = this.state.rowsPerPage
            }else{
                rowsPerPage = dados.rowsPerPage
            }

            console.log('Número da página de dentro de getResponse: ', pagina)
            try{
                return await axios.get('https://api.github.com/search/repositories?q='+ termo 
                +'+in:name&sort=stars&per_page='+rowsPerPage
                +'&page='+pagina)
            }catch(error) {
                console.error(error);

            }
        }
    
        getResponse(dados).then((response) => {
            console.log(response)
            let itens = response.data.items
            this.setState({
                itens: itens,
                showTable: true,
                numRows: getNumRows(response.data.total_count),
                rowsPerPage: getRowsPerPage(itens)
            })     
            
            console.log('Numero de linhas de dentro de getResponse: ', getNumRows(response.data.total_count))
        }) 
        
        
    
    }

    handleChangeRowsPerPage(event){
        let rowsPerPage = event.target.value
        console.log(event)
        this.setState({rowsPerPage:rowsPerPage, atualPag: 0})

        this.setData({rowsPerPage: rowsPerPage})
    }

    handleChangePage(event, page){
        this.setState({atualPag: page})
        console.log('Obj event de dentro de handleChangePage: ', event)

        this.setData({pagina:page})    
    }
    
    renderTable = () => {
        if(this.state.showTable === false){
            return(
                <div className = 'aviso'>
                    <h1>Pesquise por algum termo.</h1>
                </div>
            ); 
        }else{
            if(this.state.itens.length === 0){
                return(
                    <div className = 'aviso'>
                        <h1>Nada foi encontrado pelo termo: "{this.state.ultimoTermo}"</h1>
                    </div>
                );
            }else{
                return(
                
                    <div className='resultado'>
                    <div className = 'aviso'>
                        <h1>Resultados para: "{this.state.ultimoTermo}"</h1>
                    </div>
                    <TableContainer>
                        <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
                            <TableHead>
                                <TableRow>
                                <StyledTableCell>Nome do repositório</StyledTableCell>
                                <StyledTableCell align="right">Descrição do Repositório</StyledTableCell>
                                <StyledTableCell align="right">Nome do autor</StyledTableCell>
                                <StyledTableCell align="right">Linguagem do Repositório</StyledTableCell>
                                <StyledTableCell align="right">Número de Stars</StyledTableCell>
                                <StyledTableCell align="right">Número de Forks</StyledTableCell>
                                <StyledTableCell align="right">Data da última atualização</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {this.state.itens.map((row) => (
                                <StyledTableRow key={row.id}>
                                    <TableCell component="th" scope="row">
                                    {row.name}
                                    </TableCell>
                                    <TableCell align="right">{row.description}</TableCell>
                                    <TableCell align="right">{row.owner.login}</TableCell>
                                    <TableCell align="right">{row.language}</TableCell>
                                    <TableCell align="right">{row.stargazers_count}</TableCell>
                                    <TableCell align="right">{row.forks_count}</TableCell>
                                    <TableCell align="right">{row.updated_at}</TableCell>
                                </StyledTableRow>
                                ))}
                            </TableBody>
                            <TableFooter>
                                <TableRow>
                                    <TablePagination
                                    rowsPerPageOptions={getRowsPerPageOptions(this.state.numRows)}
                                    count={this.state.numRows}
                                    rowsPerPage={this.state.rowsPerPage}
                                    page={this.state.atualPag}
                                    onPageChange={(event,page)=>this.handleChangePage(event,page)}
                                    onRowsPerPageChange={(event) => this.handleChangeRowsPerPage(event)}
                                    />
                                </TableRow>
                            </TableFooter>
                        </Table>
                        </TableContainer>
                    </div>
                );
            }              
            
        }
    }

    

    handleOnClick(){        
        this.setState({ultimoTermo: this.state.termo})
        this.setData({})
        
    }
    

    render(){
        return(
            <div className='principal'>
                <div className='input'>
                    <TextField helperText = {"Pesquise pelo nome de um repositório"} 
                    onChange={(e) => {this.setState({termo: e.target.value})}} fullWidth id="outlined-basic" label="Pesquise aqui" variant="outlined" />
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