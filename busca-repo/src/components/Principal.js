import TextField from "@mui/material/TextField";
import { TableCell,TableRow,Table,TableHead, Button, TableBody, TableFooter, TablePagination } from '@mui/material';

import {Component} from 'react';

import {octokit} from "../token.js"

function getNumPags(link){
    
    if(link === undefined){
        return 1
    }

    // Pega o número da última página
    let links = link.split(' ')
    console.log(links)
    let nums = links.map((link)=> {
        let searchParams = new URLSearchParams(link)
        return searchParams.get('page')                
    })

    nums = nums.filter((value)=>{
        return value != null
    })

    console.log(nums)
    
    nums = nums.map((num)=>parseInt(num.replaceAll('>;', ''),10))

    nums = nums.reduce((a, b) => {
        return Math.max(a, b);
    }, -Infinity);

    return nums
    
}

function getNumRows(itens){
    return itens.length
}


class Principal extends Component{
    constructor(props){
        super(props)
        this.state = {
            itens: [],
            termo: '',
            showTable: false,
            numPags: 1,
            atualPag: 0,
            numRows: 0
        };
    }
    
    componentDidMount() {         
       
    }

    setData = (dados) => {   
       
        var getResponse = async (dados) => {

            let termo, pagina

            if(dados.termo === undefined){
                termo = this.state.termo
            }else{
                termo = dados.termo
            }

            if(dados.pagina === undefined){
                pagina = 1
            }else{
                // Soma um por causa da diferenã entre page do octokit e o TablePagination
                pagina = dados.pagina + 1
            }

            console.log('Número da página de dentro de getResponse: ', pagina)
            return await octokit.request('GET /search/repositories', {
                q: termo + ' in:name,description,readme sort:stars order:desc',
                page: pagina,
            })
            
        }
    
        getResponse(dados).then((response) => {
            console.log(response)
            let itens = response.data.items
            this.setState({
                itens: itens,
                showTable: true,
                numPags: getNumPags(response.headers.link),
                numRows: getNumRows(itens)
            })     
            
            console.log('Dentro de getResponse: ', getNumPags(response.headers.link))
        }) 
        
        
    
    }

    handleChangePage(event, page){
        this.setState({atualPag: page})
        console.log('Número da página de dentro de handleChangePage: ', page)

        this.setData({pagina:page})    
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
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                count={this.state.numRows*this.state.numPags}
                                rowsPerPage={this.state.numRows}
                                page={this.state.atualPag}
                                onPageChange={(event,page)=>this.handleChangePage(event,page)}
                                />
                            </TableRow>
                        </TableFooter>
                    </Table>
                </div>
            );
        }
    }

    

    handleOnClick(){        
        this.setData({})
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