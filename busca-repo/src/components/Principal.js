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

const DEFAULT_NUM_RESULTS = 100

function getNumRows(numRows){

    if(numRows > MAX_ROWS){
        return MAX_ROWS
    }else{
        return numRows
    }
}

function getItens(numRows,itens,atualPag,rowsPerPage){
    console.log('numRows de dentro de getItens é: ',numRows)
        if(numRows > DEFAULT_ROWS_PER_PAGE){
            return itens.slice(atualPag*rowsPerPage, 
                atualPag*rowsPerPage+rowsPerPage)
        }else{
            return itens
        }
}

var novoTermo;

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
            novaPequisa: true,
        };


    }    
    

    getRowsPerPageOptions(){
        if(this.state.numRows <= DEFAULT_ROWS_PER_PAGE){
            return [this.state.numRows]
        }else{
            if(this.state.numRows%DEFAULT_ROWS_PER_PAGE !== 0){
                return [DEFAULT_ROWS_PER_PAGE,this.state.numRows%DEFAULT_ROWS_PER_PAGE]
            }else{
                return [DEFAULT_ROWS_PER_PAGE]
            }            
        }
    }

    /*getItens(){
        console.log('numRows de dentro de getItens é: ', this.state.numRows)
        if(this.state.numRows > DEFAULT_ROWS_PER_PAGE){
            return this.state.itens.slice(this.state.atualPag*this.state.rowsPerPage, 
                this.state.atualPag*this.state.rowsPerPage+this.state.rowsPerPage)
        }else{
            return this.state.itens
        }
    
    }*/

    setData = (dados) => {   
        
        let novaPequisa 


        /*if(dados.termo === undefined){
            termo = this.state.termo
        }else{
            termo = dados.termo
        }*/

        console.log("nova pesquisa dentro de setData=", novaPequisa)
       
        let getResponse = async (dados) => {

            console.log("Entrei em getResponse")
            
            let pagina, rowsPerPage


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

            console.log("Termo: ",this.state.termo)

            console.log('Número da página de dentro de getResponse: ', pagina)
            try{
                return await axios.get('https://api.github.com/search/repositories?q='+ this.state.termo
                    +'+in:name&sort=stars&per_page='+DEFAULT_NUM_RESULTS
                    +'&page=' + this.getPage()
                ) 
            }catch(error) {
                console.error(error);
            }
        }

        console.log('pagina*rowsPerPage = ', this.state.atualPag*this.state.rowsPerPage)
        console.log('Tamanho de itens: ', this.state.itens.length)

        console.log("novaPesquisa=", novaPequisa)

        if(this.state.atualPag*this.state.rowsPerPage + this.state.rowsPerPage >= this.state.itens.length
        || this.state.termo !== this.state.ultimoTermo){

            getResponse(dados).then((response) => {

                let itens = response.data.items
                console.log(response)
                
                this.setState({
                    
                    showTable: true,
                    numRows: getNumRows(response.data.total_count),
                    //ultimoTermo: this.state.termo,
                    

                    //rowsPerPage: this.state.rowsPerPage
                })                                         
                //this.setState({itens: itens})   
                
                // Trocar this.state.termo por outra variavel por cauda dessas linhas
                if(this.state.novaPequisa === true){
                    this.setState({itens: itens, novaPequisa: false})
                }else{
                    this.setState({itens: this.state.itens.concat(itens)})
                }

                console.log('Numero de linhas de dentro de getResponse: ', getNumRows(response.data.total_count))
            
            })
                
        }  

    }

    getPage(){
        if(this.state.itens.length > 0){
            return Math.floor(this.state.itens.length/DEFAULT_NUM_RESULTS)
        }else{
            return 1
        }
    }

    handleChangeRowsPerPage(event){
        console.log("Entrou em handleChangeRowsPerPage")
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
                                {getItens(
                                    this.state.numRows,
                                    this.state.itens,
                                    this.state.atualPag,
                                    this.state.rowsPerPage).map((row) => (
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
                                    rowsPerPageOptions={this.getRowsPerPageOptions()}
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
        let novaPequisa = true
        console.log("Entrou em handleOnClick")    
        this.setState({
            ultimoTermo: this.state.termo,
            atualPag: 0,
            novaPequisa: true,
        })
        console.log("novaPesquisa dentro de handleOnClick:", novaPequisa)
        this.setData({novoTermo: novoTermo})     
        
        //this.setState({novaPequisa: true})
    }
    

    render(){
        return(
            <div className='principal'>
                <div className='input'>
                    <TextField helperText = {"Pesquise pelo nome de um repositório"} 
                    onChange={(e) => {this.setState({termo: e.target.value })}} fullWidth id="outlined-basic" label="Pesquise aqui" variant="outlined" />
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