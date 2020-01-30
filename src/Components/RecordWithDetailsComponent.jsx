import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { CSVLink } from "react-csv";
//import recordJson from '../RecordFakeDescriptor';
import axios from "axios";
class RecordWithDetailsComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formTitle : "",
            recordSelectedID : this.props.recordSelectedID,
            formID : this.props.formSelectedID,
            tableForms: [],
            tableDataRecords: [],
            isEmpty : true,
            exportArray : []
        }
    }
    getDescriptors() {
        axios.get('https://safe-tor-71958.herokuapp.com/forms/'.concat(this.state.formID),
            {
                mode:'no-cors',
                headers: {
                    "Content-Type": "text/plain",
                    "Access-Control-Allow-Origin": "*"
                }
            }).then((res) =>{

            //console.log(res["data"]["data"]);
            this.setState({formTitle :(res["data"]["data"]["title"])});
            this.setState({tableForms : res["data"]["data"]["fields"]});
            this.setState({tableDataRecords :  res["data"]["data"]["filledForms"]});
            this.setState({exportArray : this.fillExportArray()});
            if(res["data"]["data"]["filledForms"].length > 0)
            {
                this.setState({isEmpty : false});
            }
            // res["data"]["data"]["filledForms"].forEach(item =>{
            //     if(item["_id"] === this.state.recordSelectedID)
            //     {
            //         this.setState({tableDataRecords : item});
            //     }

            // });

        });
    };
    componentDidMount() {
        this.getDescriptors();
    }

    render() {
        return (
            <div>
                <header className="">
                    <h1 className="header_h">پنل مدیریت بحران</h1>
                </header>
                <div  className="jumbotron jumbotron_edit">
                    <div>
                        {
                            this.export()
                        }
                    </div>
                    <h3 className='title'>{this.state.formTitle}</h3>
                    {
                        this.isEmptyHandler()
                    }
                    <table id='Records'>
                        <tbody>
                            {this.renderTableData()}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
    // Create Table :
    renderTableData() {
        if (!this.state.isEmpty) {

            let element = [];

            this.state.tableDataRecords.forEach(record => {
                if(record["_id"] === this.state.recordSelectedID)
                {
                    let parentID = record["parentId"];
                    let id = record["_id"];
                    let filledFields = record["filledFields"];
                    element.push(<tr><td>{"شماره آیدی فرم"}</td><td>{id}</td></tr>);
                    element.push(<tr><td>{"شماره آیدی رکورد"}</td><td>{parentID}</td></tr>);
                    for(var i=0; i<this.state.tableForms.length; i++)
                    {
                        if(this.state.tableForms[i]["type"] !== "location")
                        {
                            element.push(<tr><td>{this.state.tableForms[i]["title"]}</td><td>{filledFields[this.state.tableForms[i]["name"]]}</td></tr>);
                        }
                        else
                        {
                            let locationField = filledFields[this.state.tableForms[i]["name"]];
                            element.push(<tr><td>{"latitude"}</td><td>{locationField["lat"]}</td></tr>);
                            element.push(<tr><td>{"longitude"}</td><td>{locationField["lon"]}</td></tr>);
                            if(locationField["areas"].length > 0)
                            {
                                let areas_concat = '"'.concat(locationField["areas"][0]);
                                for(let j=1; j<locationField["areas"].length; j++)
                                {
                                    //console.log(areas_concat);
                                    areas_concat = areas_concat.concat(", ").concat(locationField["areas"][j]);
                                }
                                areas_concat = areas_concat.concat('"');
                                element.push(<tr><td>{"Areas"}</td><td>{areas_concat}</td></tr>);
                            }
                        }
                    }

                }

            });
            return element;
        }
    }
    export()
    {
        if(!this.state.isEmpty)
        {
            return <CSVLink data={this.state.exportArray} filename={this.state.formTitle.concat(".csv")} type="button" className="btn btn-primary ">Export</CSVLink>
        }
    }
    isEmptyHandler()
    {
        if(this.state.isEmpty)
        {
            return(<p className="noData">لیست مورد نظر خالی می باشد و داده ای برای نمایش وجود ندارد</p>);
        }
    }
    fillExportArray()
    {
        let result = [];
        this.state.tableDataRecords.forEach(record => {
            if(record["_id"] === this.state.recordSelectedID)
            {
                let parentID = record["parentId"];
                let id = record["_id"];
                let filledFields = record["filledFields"];
                let row1 = '{"id": "'.concat(id).concat('", "parent_id": "').concat(parentID).concat('"');
                for(var i=0; i<this.state.tableForms.length; i++)
                {
                    if(this.state.tableForms[i]["type"] === "number")
                    {
                        row1 = row1.concat(',"').concat(this.state.tableForms[i]["title"]).concat('":').concat(filledFields[this.state.tableForms[i]["name"]]);
                    }
                    else if(this.state.tableForms[i]["type"] === "text" || this.state.tableForms[i]["type"] === "date")
                    {
                        row1 = row1.concat(',"').concat(this.state.tableForms[i]["title"]).concat('":"').concat(filledFields[this.state.tableForms[i]["name"]]).concat('"');
                    }else if(this.state.tableForms[i]["type"] === "location")
                    {
                        let locationField = filledFields[this.state.tableForms[i]["name"]];

                        row1 = row1.concat(',"').concat("latitude").concat('":').concat(locationField["lat"]);
                        row1 = row1.concat(',"').concat("longitude").concat('":').concat(locationField["lon"]);
                        if(locationField["areas"].length > 0)
                        {
                            let areas_concat = '"'.concat(locationField["areas"][0]);
                            for(let j=1; j<locationField["areas"].length; j++)
                            {
                                //console.log(areas_concat);
                                areas_concat = areas_concat.concat(", ").concat(locationField["areas"][j]);
                            }
                            areas_concat = areas_concat.concat('"');
                            row1 = row1.concat(',"').concat("Areas").concat('":').concat(areas_concat);
                        }
                    }

                }
                row1 = row1.concat('}');
                //console.log(row1);
                //console.log(row1);
                result.push(JSON.parse(row1));
            }

        });
        return result;
    }
}
export default RecordWithDetailsComponent