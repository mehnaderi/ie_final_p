import React,{Component} from 'react';
// import './App.css';
import FormsTableComponent from "./Components/FormsTableComponent";
import RecordsTableComponent from "./Components/RecordsTableComponent";
import RecordWithDetailsComponent from "./Components/RecordWithDetailsComponent";

class App extends Component
{
  constructor(props) {
    super(props);
    this.state = {
      pageCodeMustBeShowed : "FormsTable",
      formSelectedID : "",
      recordSelectedID : ""
    }
  }

  handleChangeToDetailsTable= () =>
  {
      this.setState({pageCodeMustBeShowed : "DetailsTable"});
  }
  handleDirection()
  {
      if(this.state.pageCodeMustBeShowed === "FormsTable")
      {
        return( <FormsTableComponent handleChangeToRecordsTable={(id)=>{
            // window.history.pushState("object or string", "Title", "/Forms/".concat(name).concat("/Records"));
            this.setState({formSelectedID : id});
            // console.log(id);
            this.setState({pageCodeMustBeShowed : "RecordsTable"});

        }}   /> );
      }else if(this.state.pageCodeMustBeShowed === "RecordsTable")
      {
        return( <RecordsTableComponent handleChangeToDetailsTable={(id)=>{
            // window.history.pushState("object or string", "Title", "/Forms/".concat(this.state.formSelectedID).concat("/Records/").concat(id));
            this.setState({recordSelectedID : id});
            this.setState({pageCodeMustBeShowed : "DetailsTable"});
        }} formSelectedID ={this.state.formSelectedID}/> );
      }else if(this.state.pageCodeMustBeShowed === "DetailsTable")
      {
        return( <RecordWithDetailsComponent recordSelectedID ={this.state.recordSelectedID} formSelectedID ={this.state.formSelectedID}/> );
      }
  }
  render() {
    return (
        <div>
          { this.handleDirection() }
        </div>
    );
  }
}
export default App;
