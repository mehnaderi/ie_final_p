import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { CSVLink } from "react-csv";
import axios from 'axios';
class FormsTableComponent extends Component {
    state = {
        tableForms: [
            // {id: 1, name: 'فرم شماره 1'},
            // {id: 2, name: 'فرم شماره 2'},
            // {id: 3, name: 'فرم شماره 3'},
            // {id: 4, name: 'فرم شماره 4'},
            // {id: 5, name: 'فرم شماره 5'},
            // {id: 6, name: 'فرم شماره 6'},
            // {id: 7, name: 'فرم شماره 7'},
            // {id: 8, name: 'فرم شماره 8'},
            // {id: 9, name: 'فرم شماره 9'},
            // {id: 10, name: 'فرم شماره 10'}
            ],
        isEmpty : true
    };
    getForms() {
        axios.get('https://safe-tor-71958.herokuapp.com/form_descriptors',
            {
                mode:'no-cors',
                headers: {
                    "Content-Type": "text/plain",
                    "Access-Control-Allow-Origin": "*"
                }
            }).then((res) =>{
                // console.log(res);
                let getTableForms = [];
                res["data"]["data"].forEach(form =>{
                        let title = form["title"];
                        let id= form["_id"];
                        let row = '{"id": "'.concat(id).concat('", "name": "').concat(title).concat('"}');
                        getTableForms.push(JSON.parse(row));
                });
                this.setState({tableForms : getTableForms});
                if(getTableForms.length > 0)
                {
                    this.setState({isEmpty : false});
                }
        });
    };
    componentDidMount() {
        this.getForms();
        this.setState({goToPage : false});
        //Click Configuration :

    }
    componentDidUpdate(prevProps, prevState, snapshot) {
        if(this.state.tableForms.length >0)
        {
            const rows = document.querySelectorAll("tr[data-id]");
            // console.log(rows);
            rows.forEach(row =>
            {
                row.addEventListener("click", () =>{
                    this.clickRowImplementation(row.dataset.id);
                });
            });
        }
    }

    render() {
        return (
            <div>
                {
                    this.Redirection()
                }
                <header className="">
                    <h1 className="header_h">پنل مدیریت بحران</h1>
                </header>
                <div  className="jumbotron jumbotron_edit">
                    <div>
                        {
                            this.export()
                        }
                    </div>
                    <h3 className='title'>جدول فرم ها</h3>
                    {
                        this.isEmptyHandler()
                    }
                    <table id='Forms'>
                        <tbody>
                        <tr>{this.renderTableHeader()}</tr>
                        {this.renderTableData()}
                        {this.componentDidUpdate()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
    export()
    {
        if(!this.state.isEmpty)
        {
            return <CSVLink data={this.state.tableForms} filename="FormsTable.csv" type="button" className="btn btn-primary ">Export</CSVLink>
        }
    }
    Redirection()
    {
        if(this.state.goToPage === true)
        {
            // window.open("localhost:3000/"+this.state.nextPageID);
            // this.setState({goToPage : false});
            // this.props.history.push("/RecordsTableComponent/" + this.state.nextPageID);
            // return (<Router><Route exact path={"/"+this.state.nextPageID} component={RecordsTableComponent} /></Router> );
            // return (<Redirect to={"/"+this.state.nextPageID}/>);
        }
    }
    clickRowImplementation(id)
    {
        let myId= 0;
        for (var i=0; i<this.state.tableForms.length; i++)
        {
            if(this.state.tableForms[i].id === id)
            {
                myId = i;
            }
        }
        this.props.handleChangeToRecordsTable(this.state.tableForms[myId].id);
    }

    renderTableData() {
        if(!this.state.isEmpty)
        {
            return this.state.tableForms.map((tableFormItem) => {
                const {id, name} = tableFormItem; //destructuring
                // console.log(tableFormItem)
                return (
                    <tr key={id} data-id={id}>
                        <td>{id}</td>
                        <td>{name}</td>
                    </tr>
                )
            });
        }
    }
    renderTableHeader() {
        if(!this.state.isEmpty)
        {
            let header = Object.keys(this.state.tableForms[0]);
            return header.map((key, index) => {
                return <th key={index}>{key.toUpperCase()}</th>
            })
        }

    }
    isEmptyHandler()
    {
        if(this.state.isEmpty)
        {
            return(<p className="noData">لیست مورد نظر خالی می باشد و داده ای برای نمایش وجود ندارد</p>);
        }
    }
}
export default FormsTableComponent