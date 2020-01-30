import React, { Component } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { CSVLink } from "react-csv";
import axios from "axios";
class RecordsTableComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formTitle : "",
            formID : this.props.formSelectedID,
            howRenderTable : "default",
            tableForms: [],
            tableDataRecords: [],
            filterVisibility : false,
            selectPolygon : "Select",
            selectFilterType : "Select",
            isEmpty : true,
            listOfPolygons : [],
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
        this.setState({formTitle :"رکورد های ".concat(res["data"]["data"]["title"])});
        this.setState({tableForms : res["data"]["data"]["fields"]});
        this.setState({tableDataRecords : res["data"]["data"]["filledForms"]});
        this.setState({exportArray : this.fillExportArray()});
        this.setState({listOfPolygons : this.fillListOfPolygons()});
        if(res["data"]["data"]["filledForms"].length > 0)
        {
            this.setState({isEmpty : false});
        }
   });
};

    componentDidMount() {
        this.getDescriptors();
        //this.setState({exportArray : this.fillExportArray()});
    }
    componentDidUpdate() {
        if(this.state.tableDataRecords.length >0)
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
                <header className="">
                    <h1 className="header_h">پنل مدیریت بحران</h1>
                </header>
                <div  className="jumbotron jumbotron_edit">
                    <div>
                        {
                            this.export()
                        }
                        {
                            this.filter()
                        }
                    </div>
                    <h3 className='title'>{this.state.formTitle}</h3>
                    {
                        this.isEmptyHandler()
                    }
                    <table id='Records'>
                        <tbody>
                        <tr>{this.renderTableHeader()}</tr>
                        {this.renderTableData()}
                        <tr>{this.renderLastRow()}</tr>
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
            return <CSVLink data={this.state.exportArray} filename={this.state.formTitle.concat(".csv")} type="button" className="btn btn-primary ">Export</CSVLink>
        }
    }
    filter()
    {
        if(!this.state.isEmpty)
        {
            return(
                <div className="filterDiv">
                    <button data={this.state.tableForms} type="button"
                    onClick={()=> { this.setState({filterVisibility : !this.state.filterVisibility});
                     this.setState({selectFilterType: "Select"});
                     this.setState({selectPolygon: "Select"});
                     this.setState({howRenderTable : "default"});
                     }}
                     className="btn btn-primary filterBtn">Filter</button>
                    <form className={this.state.filterVisibility ? "filterForm visible" : "filterForm invisible"}>
                        <div className="form-group divInputText">
                          <label >Filter by :</label>
                          <select
                          className="form-control filterSelector" onChange={this.changeFilterTypeSelector} value={this.state.selectFilterType}
                          id="filterTypeSelector">
                              <option key="filter_select">Select</option>
                              <option key="filter_location">Location</option>
                              <option key="filter_text">Text</option>
                              <option key="filter_numeric">Numeric</option>
                          </select>
                        </div>
                        <div
                            className={this.state.filterVisibility ? this.state.selectFilterType==="Text"?"form-group divInputText visible":"form-group divInputText invisible" : "form-group divInputText invisible"}>
                          <label>Text:</label>
                          <input type="text" className="form-control inputText" id="textPicker"/>
                        </div>
                        <div
                          className={this.state.filterVisibility ? this.state.selectFilterType==="Numeric"?"form-group divInputText visible":"form-group divInputText invisible" : " form-group divInputText invisible"}>
                          <label>Number:</label>
                          <input type="number" className="form-control inputText" id="numberPicker"/>
                        </div>
                        <div className={
                          this.state.filterVisibility ? this.state.selectFilterType==="Location"?"form-group filterSelector visible":" form-group filterSelector invisible" : "form-group filterSelector invisible"}>
                          <label>Location :</label>
                          <select onChange={this.changePolygonSelector} value={this.state.selectPolygon}
                          id="filterLocationSelector"
                          className="form-control filterSelector">
                              {
                                this.selectPolygon()
                              }
                          </select>
                        </div>
                         <button data={this.state.tableForms} type="button"
                            onClick={()=> {this.state.selectFilterType ==="Text"?this.setState({howRenderTable : "Text"}):
                                (this.state.selectFilterType ==="Numeric"?this.setState({howRenderTable : "Numeric"}):this.setState({howRenderTable : "default"}))}}
                             className={this.filterButtonVisibility()}>Ok</button>

                    </form>
                </div>

            );
        }
    }

    filterButtonVisibility()
    {
        let result = "";
        if(this.state.selectFilterType === "Select")
         {
            result = "btn btn-primary invisible okBtnStyle";
            //this.setState({howRenderTable: "default"});
         }else
         {
             if(this.state.selectFilterType === "Location")
             {
                result = "btn btn-primary invisible okBtnStyle"
             }else
             {
                 result = "btn btn-primary visible okBtnStyle";
             }
         }
         return result;
    }
    changeFilterTypeSelector = (e)=> {
         this.setState({selectFilterType: e.target.value});
         if(e.target.value === "Select")
         {
            this.setState({howRenderTable : "default"});
         }
    }

    changePolygonSelector = (e)=> {
         this.setState({selectPolygon: e.target.value});
         if(e.target.value === "Select")
         {
            this.setState({howRenderTable: "default"});
         }
         else
         {
            this.setState({howRenderTable: "Location"});
         }
    }

    clickRowImplementation(id)
    {
    //console.log(this.state.tableDataRecords);
        // TODO: this method should be implemented
        let temp = "";
        this.state.tableDataRecords.forEach(record =>{
            if(record["_id"] === id)
            {
                temp = id;
            }
        });
        this.props.handleChangeToDetailsTable(temp);
    }

    // Create Table :
    renderTableData() {
        if(!this.state.isEmpty){

        let element = [];
        if(this.state.howRenderTable === "default")
        {
            this.state.tableDataRecords.map((recordItem) => {
                // console.log(recordItem["id"]);
                //console.log(recordItem["_id"]);
                element.push(<tr key={recordItem["_id"]} data-id={recordItem["_id"]}>{this.createElements(recordItem)}</tr>);
            });
        }else if(this.state.howRenderTable === "Location")
        {
            //console.log(this.state.selectPolygon);
            this.state.tableDataRecords.forEach(recordItem =>
            {

                let hasThisPolygon = false;
                for(var i=0; i<this.state.tableForms.length; i++)
                {
                    if(this.state.tableForms[i]["type"] === "location")
                    {

                        let loc = recordItem["filledFields"][this.state.tableForms[i]["name"]];
                        loc["areas"].forEach(area =>{
                            //console.log(area);
                            if(area === this.state.selectPolygon)
                            {
                                hasThisPolygon = true;
                            }
                        });
                    }
                }
                if(hasThisPolygon)
                {
                    element.push(<tr key={recordItem["_id"]} data-id={recordItem["_id"]}>{this.createElements(recordItem)}</tr>);
                    //element.push(item["id"]);
                }
            });

        }else if(this.state.howRenderTable === "Text")
        {
            var searchText = document.getElementById("textPicker").value.toLowerCase();

            this.state.tableDataRecords.forEach(recordItem =>
            {
                let hasThisText = false;
                for(var i=0; i<this.state.tableForms.length; i++)
                {
                    if(this.state.tableForms[i]["type"] === "text")
                    {
                        //console.log(recordItem["filledFields"][this.state.tableForms[i]["name"]]);
                        let thisItem =(recordItem["filledFields"][this.state.tableForms[i]["name"]]).toString().toLowerCase();
                        if( thisItem.includes(searchText))
                        {
                            hasThisText = true;
                        }
                    }
                }
                if(hasThisText)
                {
                    element.push(<tr key={recordItem["_id"]} data-id={recordItem["_id"]}>{this.createElements(recordItem)}</tr>);
                }
            });

        }else if(this.state.howRenderTable === "Numeric")
        {
            var searchNumber = Number(document.getElementById("numberPicker").value);

            this.state.tableDataRecords.forEach(recordItem =>
            {
                let hasThisNumber = false;
                for(var i=0; i<this.state.tableForms.length; i++)
                {
                    if(this.state.tableForms[i]["type"] === "number")
                    {
                        var thisItem =(recordItem["filledFields"][this.state.tableForms[i]["name"]]);
                        if( thisItem === searchNumber)
                        {
                            hasThisNumber = true;
                        }

                    }
                }
                if(hasThisNumber)
                {
                    element.push(<tr key={recordItem["_id"]} data-id={recordItem["_id"]}>{this.createElements(recordItem)}</tr>);
                }
            });
        }
        return element;
        }
    }
    createElements(item)
    {
        let element = [];
        element.push((<td>{item["_id"]}</td>));
        for(let i=0; i<this.state.tableForms.length; i++)
        {
             //console.log(this.state.tableForms);
             //console.log(item["filledFields"][this.state.tableForms[i]["name"]]);
             if(this.state.tableForms[i]["type"] === "location")
             {
                 let locationField = item["filledFields"][this.state.tableForms[i]["name"]];
                 let row1 = '"'.concat("latitude").concat('":').concat(locationField["lat"]);
                 row1 = row1.concat(', "').concat("longitude").concat('":').concat(locationField["lon"]);
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
                  element.push((<td>{row1}</td>))
             //   element.push((<td>{}</td>))
             }else
             {
                element.push((<td>{item["filledFields"][this.state.tableForms[i]["name"]]}</td>))
             }
        }
        //element.push((<td>{JSON.stringify(item["Polygons"])}</td>));
        return element;
    }
    renderTableHeader() {
        if(this.state.tableDataRecords.length > 0)
        {
            let element = [];
            element.push(<th key="ID">ID</th>);
            this.state.tableForms.forEach(tableFormItem =>{
                element.push(<th key={tableFormItem["title"].toUpperCase()}>{tableFormItem["title"].toUpperCase()}</th>);
            });
            //element.push(<th key="POLYGONS">POLYGONS</th>);
            return element;
        }
    }
    renderLastRow() {
        if(this.state.howRenderTable === "default" && !this.state.isEmpty)
        {
        //console.log(this.state.isEmpty);
        //console.log(this.state.tableDataRecords.length);
                let element = [];
                element.push((<td>SUM</td>));
                for(let i=0; i<this.state.tableForms.length; i++)
                {
                    if(this.state.tableForms[i]["type"] === "number")
                    {
                        //console.log()
                        let sum = 0;
                        this.state.tableDataRecords.forEach((recordItem) => {
                                if(recordItem["filledFields"][this.state.tableForms[i]["name"]] !== undefined)
                                {
                                    sum += recordItem["filledFields"][this.state.tableForms[i]["name"]];
                                }

                            });
                        element.push(<td>{sum}</td>);
                    }else
                    {
                        element.push((<td>-</td>))
                    }
                }
                //element.push(<td>-</td>);
                return element;
        }
    }

    // Filter Table with Polygon:
    isInArrayAreas(result1, area)
    {
        //this.state.listOfPolygons.forEach(polygon =>{
        //    if(polygon === area)
         //   {
           //     return true;
           // }
       // });
        for(let i=0; i<result1.length; i++)
        {
            if(result1[i] === area)
            {
                return true;
            }
        }
        return false;
    }
    selectPolygon(){
            let result = [];
            result.push(<option key={"Select"} className="selectOption">{"Select"}</option>);
            this.state.listOfPolygons.forEach(polygon =>{
                result.push(<option key={polygon} className="selectOption">{polygon}</option>);
            });
            return result;
    }
    fillListOfPolygons()
    {
        let result1 = [];
        this.state.tableDataRecords.forEach(recordItem =>
        {
            for(var i=0; i<this.state.tableForms.length; i++)
            {
                if(this.state.tableForms[i]["type"] === "location")
                {
                    let loc = recordItem["filledFields"][this.state.tableForms[i]["name"]];
                    console.log(loc["areas"]);

                    loc["areas"].forEach(area =>{
                        console.log(this.isInArrayAreas(area));
                        if(!this.isInArrayAreas(result1, area))
                        {
                            result1.push(area);
                        }
                    });
                }
            }

        });
        return result1;
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
        });
        return result;
    }
}
export default RecordsTableComponent