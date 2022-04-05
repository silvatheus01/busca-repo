import TextField from "@mui/material/TextField";
import { TableCell,
    TableRow,
    Table,
    TableHead, 
    Button, 
    TableBody, 
    TableFooter, 
    TablePagination,
    TableContainer,
    CircularProgress,
} from '@mui/material';

import {Component} from 'react';
import {StyledTableCell,StyledTableRow} from "../style"

const axios = require('axios');

// Quantidade maxima de "linhas" que a api pode retornar
const MAX_ROWS = 1000

// Quantidade máxima de linhas que são mostradas na tabela
const MAX_ROWS_PER_PAGE = 10

// Quantidade padrão de itens que a API está retornando
const DEFAULT_NUM_RESULTS = 100

// Primeira página do resultado da API é sempre 1
const FIRST_PAGE_API = 1

// Retorna a quantidade máxima de linhas da tabela
function getNumRows(numRows){

    if(numRows > MAX_ROWS){
        return MAX_ROWS
    }else{
        return numRows
    }
}

// Guarda o termo atual que é digitado no campo de texto (TextField)
var termo;

class Principal extends Component{
    constructor(props){
        super(props)
        this.state = {
            // Itens (Dados referentes ao repositório) retornados pela API
            itens: [],
            // Guarda o termo atual que foi pesquisado
            termo: '',
            // Último termo pesquisado
            ultimoTermo: '',
            // Controla o aparecimento da tabela na tela
            showTable: false,
            // Pagina da tabela
            tablePage: 0,
            // Linhas da tabela mostradas em apenas uma página
            rowsPerPage: MAX_ROWS_PER_PAGE,
            // Número total de linhas da tabela
            numRows: 0,
            // Controla se um termo novo foi pesquisado
            novaPequisa: true,
            // Controla se a aplicação está esperando a resposta da API 
            isLoading: false,
            // Página do resultado da API
            apiPage: FIRST_PAGE_API,
        };
    }    


    // Retorna alguns ou todos os itens através da lista de itens
    getItens(){
        if(this.state.numRows > MAX_ROWS_PER_PAGE){
            return this.state.itens.slice(this.state.tablePage*this.state.rowsPerPage, 
                this.state.tablePage*this.state.rowsPerPage+this.state.rowsPerPage)
        }else{
            return this.state.itens
        }
    }
    

    // Retorna as possíveis opções de linhas por página da tabela
    getRowsPerPageOptions(){
        if(this.state.numRows <= MAX_ROWS_PER_PAGE){
            return [this.state.numRows]
        }else{
            if(this.state.numRows%MAX_ROWS_PER_PAGE !== 0){
                return [MAX_ROWS_PER_PAGE,this.state.numRows%MAX_ROWS_PER_PAGE]
            }else{
                return [MAX_ROWS_PER_PAGE]
            }            
        }
    }

    // Faz alterações no state depois de alguma alteração no front
    setData = (dados) => {   
        
        let apiPage
       
        // Retorna a resposta da API
        let getResponse = async (dados) => {

            this.setState({isLoading: true})

            /*Se a página da API não é passada, pegamos a que está no state,
            caso contrário tomamos que é a primeira página do resultado da API*/
            if(dados.apiPage === undefined){
                apiPage = this.state.apiPage
            }else{
                apiPage = FIRST_PAGE_API
            }

            // Tenta fazer a requisição GET a API do Github
            try{
                return await axios.get('https://api.github.com/search/repositories?q='+ termo
                    +'+in:name&sort=stars&per_page=' + DEFAULT_NUM_RESULTS
                    +'&page=' + apiPage
                ) 
            }catch(error) {
                console.error(error);
            }
        }

        // Se avançarmos muito na paginação ou se o novo termo é diferente do último, fazemos uma requisição
        if(this.state.tablePage*this.state.rowsPerPage + this.state.rowsPerPage >= this.state.itens.length
        || termo !== this.state.ultimoTermo){  

            // Chama getResponse e passa os parâmetros necessários
            getResponse(dados).then((response) => {

                let itens = response.data.items               
                this.setState({                    
                    showTable: true, // Agora a tabema pode ser mostrada
                    numRows: getNumRows(response.data.total_count),
                    isLoading: false,
                    ultimoTermo: termo, // Como o termo atual já foi pesquisado, ele se torna o último termo pesquisado
                    apiPage: apiPage+1  // Incrementamos essa variável para a próxima requisição
                })                                            
                
                // Se a busca é por um novo termo, os itens encontrados anteriormente não serão mais utilizados
                if(this.state.novaPequisa === true){
                    this.setState({itens: itens, novaPequisa: false})
                }else{
                    // Caso contrário, concatenamos a próxima página de itens aos itens encontrados anteriormente
                    this.setState({itens: this.state.itens.concat(itens)})
                }            
            })       
                
        }  

    }

    // Manipula a mudança de linhas por página da tabela
    handleChangeRowsPerPage(event){
        let rowsPerPage = event.target.value
        this.setState({rowsPerPage:rowsPerPage, tablePage: 0})
        this.setData({})
    }

    // Manipula a mudança de página da tabela
    handleChangePage(event, page){
        this.setState({tablePage: page})
        this.setData({})    
    }
    
    // Renderiza a tabela através de critérios
    renderTable = () => {
        if(this.state.showTable === false){
            return(
                <div className = 'aviso'>
                    <h1>Pesquise por algum termo.</h1>
                </div>
            ); 
        }else{
            // Se o array itens está vazio, então nada foi retornado para o termo pesquisado
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
                                    {this.getItens().map((row) => (
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
                                        page={this.state.tablePage}
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

    // Manipula o click no botão pesquisar
    // Sempre é chamada quando um termo é pesquisado
    handleOnClick(){              
        this.setState({
            tablePage: 0,
            novaPequisa: true,
            termo: termo,
            rowsPerPage: MAX_ROWS_PER_PAGE
        })       
        this.setData({apiPage: FIRST_PAGE_API})          
    }

    // Renderiza o botão ou a animação de carregamento
    renderButton = () =>{
        if(this.state.isLoading){
            return (
                <CircularProgress/>
            )
        }else{
            return <Button onClick={()=>this.handleOnClick()} variant="contained">Pesquisar</Button>
        }   
    }
    

    render(){
        return(
            <div className='principal'>
                <div className='input'>
                    <TextField helperText = {"Pesquise pelo nome de um repositório"} 
                    onChange={(e) => {termo = e.target.value}} fullWidth id="outlined-basic" label="Pesquise aqui" variant="outlined" />
                </div>
                <div className='botao'>
                    {this.renderButton()}
                </div>
                {this.renderTable()}                
            </div>
        );
    }
}

export default Principal