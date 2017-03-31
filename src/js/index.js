import React,{Component} from 'react';
import ReactDom from  "react-dom";
import '../less/index.less';

window.requestAnimFrame =  (function(callBack){
    return window.requestAnimationFrame || 
           window.mozRequestAnimationFrame ||
           window.webkitRequestAnimationFrame ||
           function (callBack){
               window.setTimeout(callBack,1000)
           }
});
//     var i  = 0 ;

// function test(){   
//     if(i == 10){
//         cancelAnimationFrame(exe);
//     }else{
//         i++;
//        var exe =  requestAnimationFrame(test);
//     }
//     console.log(i)
// }
// test()

var data = null;
let ajax = function(url,type,flag,oData,callBack){
    let xhr = null;
    if(window.XMLHttpRequest){
        xhr = new window.XMLHttpRequest();
    }else{
        xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }                                            
    let method  = type.toUpperCase();
    if(method == 'GET'){
        url += '?'+ oData + new Date().getTime(); 
        xhr.open("get",url,flag);
    }else{
        xhr.open('post',url,flag); 
    }
    xhr.onreadystatechange = function(){
        if(xhr.readyState === 4 && xhr.status === 200){
            callBack(xhr.responseText)
        }
    }
    if(method =='GET'){
        xhr.send();
    }else{
        xhr.setRequestHeader('Content-type','application/x-www-form-urle');
        xhr.send(oData);
    }
}
class App extends Component {
    constructor(){
        super ();
        this.state = {
            filterText:'',
            invited:[],
            count:0
        }
    }
    onChangeText(e){
        this.setState({
            filterText:e.target.value
        })
    }
    onHandleClick (name,flag){
        // let eve = e ||window.event;
        // let target = eve.target||eve.srcElement;
        // 打印target 结果为 react（如果把name改为e）
        let symbol;
        this.showInvited = []
        if(flag){
            if(this.state.count /2 != 0 ){
                symbol = '、' ;
                this.state.invited.unshift(symbol);
            }
            this.state.invited.unshift(name)
        }else{
           let index = this.state.invited.indexOf(name);
           if(index > 1){
               this.state.invited.splice(index -1 ,2)
           }else if(index == 0 && (this.state.invited.length > 1)){
               this.state.invited.splice(index,2)
           }else{
               this.state.invited.splice(index,1)
           }
        }
        this.setState({
            count : this.state.count + 1
        })
        for(let i = 0;i< 5;i++){
            this.showInvited.push(this.state.invited[i])
        }
    }
    render (){
        return (
            <div className = 'wrapper'>
                <SearchBar invited = {this.showInvited}  onChangeText = {this.onChangeText.bind(this)}></SearchBar>
                <ListBox oData = {this.props.oData} onHandleClick = {this.onHandleClick.bind(this)} filterText = {this.state.filterText}></ListBox>
            </div>
        )
    }
}
class SearchBar extends Component {
    render (){
        return (
            <div className = 'search-bar'>
                <div className="people-invited">
                    你已经邀请了<span>{this.props.invited}</span>等多少人
                </div>
                <div className="inp-box">
                    <input  onChange = {this.props.onChangeText} placeholder ='请输入你想要找的人' type="text"/>
                </div>
            </div>          
        )
    }
}
class ListBox extends Component{
    componentWillMount (){
        this.onHandleChange()
    }
    onHandleChange(){
        let oData = this.props.oData,
            index = 0,
            text = this.props.filterText,
            list = [];
        for(let props in oData){
            index++;
            if(text == ''){
                list.push(
                    <ListItem onHandleClick = {this.props.onHandleClick} myInfo = {oData[props]} key = {index + 100}></ListItem>            
                )
            }else if(oData[props][1].indexOf(text) !== -1 || oData[props][2].indexOf(text) !== -1){
                list.push(
                    <ListItem onHandleClick = {this.props.onHandleClick} myInfo = {oData[props]} key = {index + 100}></ListItem>            
                )
            }
        }
        this.list = list;
    }
    shouldComponentUpdate(){
        this.onHandleChange();
        return true;
    }
    render(){
        return(
            <div className = 'info-wrap'>
                <ul className="list-box">
                    {this.list}
                </ul>
            </div>
        )
    }
}

class ListItem extends Component{
    constructor (){
        super();
        this.state = {
            flag: true
        }
    }
    onClickBtn (){
        this.setState({
            flag:!this.state.flag
        })
        this.props.onHandleClick(this.props.myInfo[1],this.state.flag)
    }
    render(){
        return(
            <li className = 'list-item'>
                <div className="img-box">
                    <img src={this.props.myInfo[0]} alt=""/>
                </div>
                <div className="people-introduce">
                    <h3>{this.props.myInfo[1]}</h3>
                    <div className="invite-box">
                        <span>{this.props.myInfo[2]}</span>
                        <span>{this.props.myInfo[3]}</span>
                    </div>
                    <button onClick = {this.onClickBtn.bind(this)}  style = {{'background':(this.state.flag? 'green':'black')}} className = 'to-invite'>
                        {this.state.flag ? '邀请':'收回'}
                        <br/>
                        回答
                    </button>
                </div>
            </li>
        )
    }
}
ajax("../data.txt",'get',true,'',function(datas){
    data = JSON.parse(datas); 
    ReactDom.render(
        <App oData = {data}/>,
        document.getElementById('demo')
    )
})

// 你需要 ../data.txt 退出out/文件夹下  
// 因为是打包到服务器 所以src都必须要从index.html那个层级