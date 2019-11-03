import React from 'react';
import { StyleSheet, Text, View,StatusBar, 
   TouchableOpacity, SafeAreaView, ScrollView,FlatList, ActivityIndicator,ToastAndroid, BackHandler } from 'react-native';

import {AntDesign} from "@expo/vector-icons"
import { SearchBar,Tile,Button, ListItem} from 'react-native-elements';
import * as Animatable from "react-native-animatable";
import WebView from 'react-native-webview';
import AnimatedHideView from 'react-native-animated-hide-view';
import{createAppContainer} from 'react-navigation'
import {createStackNavigator} from "react-navigation-stack";


class App extends React.Component {
  state = {
    search: '',
    recent:[
      {
        name:"초밥가게부인"
      },
      {
        name:"초밥가게사장"
      },
    ],
    
    ChildVisible:true,
    
  };
  


  _startAnimation = ()=>{
    
  }
  updateSearch = (value) => {
    this.setState({ search : value });
  };
  _searching=()=>{
    this.setState({
      search:'',
      recent: [{name:this.state.search}].concat(this.state.recent),
      
    });}

    _press =({item,index})=>{
      return(
      <View style={styles.lineContainer}>
        
        <Text style={{fontSize:20}}>{item.name}  </Text>
        
        <TouchableOpacity> 
        <AntDesign onPress={
          ()=>{
            const new_ = [...this.state.recent];
            new_.splice(index,1);
            this.setState({recent:new_});
          }
        } name="closecircleo" size={20}/> 
        </TouchableOpacity>
        </View> );
    }



 //웹뷰를 위해
  constructor(props) {
      super(props);
      this.WEBVIEW_REF = React.createRef();
  }

  // 이벤트 등록
  componentDidMount() {
      BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
  }

  // 이벤트 해제
  componentWillUnmount() {
      this.exitApp = false;
      BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
  }

  // 이벤트 동작
  handleBackButton = () => {
      // 2000(2초) 안에 back 버튼을 한번 더 클릭 할 경우 앱 종료
      if (this.exitApp == undefined || !this.exitApp) {
          ToastAndroid.show('한번 더 누르시면 종료됩니다.', ToastAndroid.SHORT);
          this.exitApp = true;
          
          this.WEBVIEW_REF.current.goBack();
          this.timeout = setTimeout(
              () => {
                  this.exitApp = false;
              },
              2000    // 2초
          );
      } else {
          clearTimeout(this.timeout);

          BackHandler.exitApp();  // 앱 종료
      }
      return true;
  }
  onNavigationStateChange(navState) {
    this.setState({
      canGoBack: navState.canGoBack
    });
  }

  render() {
    const { search } = this.state;
    const isChildVisible = this.state.ChildVisible;


    return (
      <SafeAreaView style={styles.container}>
      <StatusBar hidden={true}/>
      <View style={{flex:1,width:"100%",backgroundColor:"red",zIndex:-10}}>
          <WebView
            style={{flex:1,width:"100%"}}
            source={{uri:'http://m.inven.co.kr/fifaonline4/player/'}}
            ref={this.WEBVIEW_REF}
            onNavigationStateChange={this.onNavigationStateChange.bind(this)}
          />
      </View>
      <AnimatedHideView 
       visible={isChildVisible}
       style={{zIndex:10,position: 'absolute'}}>
          <View style={styles.container}>
            
            <Animatable.View style={styles.card} animation="slideInDown" iterationCount={1} direction="alternate"> 
              <Tile
                imageContainerStyle={{backgroundColor:"snow",marginTop:0,}}
                onPress={this._startAnimation}
                activeOpacity ={1}
                title="피파온라인4 전적검색"
                titleStyle={{color:"black"}}
                featured
                captionStyle={{color:"black"}}
                caption="닉네임을 통해 여러 정보를 검색하세요!"
              />
              <SearchBar
                placeholder="닉네임을 입력해 주세요"
                onChangeText={this.updateSearch}
                value={search}
                round={true}
                containerStyle={styles.search,{backgroundColor:"snow"}}
                inputContainerStyle={{backgroundColor:"black"}}
                onEndEditing={
                  this._searching,
                  () =>{
                  this.props.navigation.navigate('Prof',
                  {name:search})}
                }
              />
              <View style={{height:"100%",backgroundColor:"white",opacity:0.8}}>
                  
              </View>
              
          </Animatable.View>


          </View>
        </AnimatedHideView>
        <View style={{width:"100%",flex:1,zIndex:10, position:'absolute',paddingRight:10,backgroundColor:"snow",alignItems:"flex-end"}}>
          <TouchableOpacity  > 
          <Text  onPress={
            ()=>{
              this.setState({ChildVisible:!this.state.ChildVisible});
            }
          }style={{color:"black",fontSize:18}}>검색창 on/off </Text> 
          </TouchableOpacity>
        </View>

      </SafeAreaView>

    );
  }
}


class Profile extends React.Component{
  
  constructor(props){
    super(props);
    this.state ={ isLoading: true}
  }

  // 이벤트 등록
  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.handleBackButton);
    
    const { navigation } = this.props;
    const text = JSON.stringify(navigation.getParam('name', '초밥가게부인'));
    //{JSON.stringify(navigation.getParam('받은거 이름', '기본값'))} 

    
    //유저 accessid 알아내기
    fetch("https://api.nexon.co.kr/fifaonline4/v1.0/users?nickname="+text.slice(1,text.length-1)
    ,{headers: {Authorization:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiNTUzOTA0ODEwIiwiYXV0aF9pZCI6IjIiLCJ0b2tlbl90eXBlIjoiQWNjZXNzVG9rZW4iLCJzZXJ2aWNlX2lkIjoiNDMwMDExNDgxIiwiWC1BcHAtUmF0ZS1MaW1pdCI6IjIwMDAwOjEwIiwibmJmIjoxNTcyNjkzOTU3LCJleHAiOjE2MzU3NjU5NTcsImlhdCI6MTU3MjY5Mzk1N30.Vgey-uDJYTTrROKq6_RSJlSjK0Q6DbZ2mIgyCxrTDKQ"},})
    .then(response => response.json())
    .then((json) => {
       this.setState({
        isLoading: false,
        nick: json.nickname,
        id: json.accessId,
        level: json.level,
        match_ids:[
          
        ],
        match_details:[
          
        ],
       });
       }).catch((error) =>{
        console.error(error);
        return error;
      });
}

// 이벤트 해제
componentWillUnmount() {
    this.exitApp = false;
    BackHandler.removeEventListener('hardwareBackPress', this.handleBackButton);
}

// 이벤트 동작
handleBackButton = () => {
  this.props.navigation.navigate('Home');
  return true;
}
_press =({item,index})=>{
  this.setState({match_details:this.state.match_details.sort().reverse()})
  const first_color = item[2]=="승"? "green":"red";
  const second_color = item[2]=="승"? "red":"green";
  return(
    <View style={styles.container}>
    <View style={{marginLeft:15,height:60,width:"90%",borderColor:"black",margin:10,padding:10}}>
       <Text><Text>{item[1]}</Text> <Text style={{color:first_color,fontSize:18}}>{item[2]}</Text> VS <Text>{item[3]}</Text> <Text style={{color:second_color,fontSize:18}}>{item[4]}</Text><Text >( {item[5]} : {item[6]} )</Text></Text>
       <Text style={{color:"gray",fontSize:12}}>{item[0]}</Text>
       
    </View>
   </View>
  );
}
_mainmatch=()=>{
   // 공식경기 매치정보 조회
   if(!this.isLoading){
   this.setState({isLoading:true})  
   fetch("https://api.nexon.co.kr/fifaonline4/v1.0/users/"+this.state.id+"/matches?matchtype=50&limit=20"
   ,{headers: {Authorization:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiNTUzOTA0ODEwIiwiYXV0aF9pZCI6IjIiLCJ0b2tlbl90eXBlIjoiQWNjZXNzVG9rZW4iLCJzZXJ2aWNlX2lkIjoiNDMwMDExNDgxIiwiWC1BcHAtUmF0ZS1MaW1pdCI6IjIwMDAwOjEwIiwibmJmIjoxNTcyNjkzOTU3LCJleHAiOjE2MzU3NjU5NTcsImlhdCI6MTU3MjY5Mzk1N30.Vgey-uDJYTTrROKq6_RSJlSjK0Q6DbZ2mIgyCxrTDKQ"},})
   .then(response => response.json())
   .then((json) => {
      this.setState({
       match_ids: json,
      });
      }).catch((error) =>{
       console.error(error);
       return error;
     });
     
    this.state.match_details = []
    
    for(var t =0; t< this.state.match_ids.length;t++){
      fetch("https://api.nexon.co.kr/fifaonline4/v1.0/matches/"+this.state.match_ids[t]
      ,{headers: {Authorization:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiNTUzOTA0ODEwIiwiYXV0aF9pZCI6IjIiLCJ0b2tlbl90eXBlIjoiQWNjZXNzVG9rZW4iLCJzZXJ2aWNlX2lkIjoiNDMwMDExNDgxIiwiWC1BcHAtUmF0ZS1MaW1pdCI6IjIwMDAwOjEwIiwibmJmIjoxNTcyNjkzOTU3LCJleHAiOjE2MzU3NjU5NTcsImlhdCI6MTU3MjY5Mzk1N30.Vgey-uDJYTTrROKq6_RSJlSjK0Q6DbZ2mIgyCxrTDKQ"},})
      .then(response => response.json())
      .then((json) => {
      this.setState({
        match_details : this.state.match_details.concat(
          [[
        json.matchDate,
        json.matchInfo[0].nickname,
        json.matchInfo[0].matchDetail.matchResult,
        json.matchInfo[1].nickname,
        json.matchInfo[1].matchDetail.matchResult,
        json.matchInfo[0].shoot.goalTotal,
        json.matchInfo[1].shoot.goalTotal,
        this.state.match_ids[t],
      ]]
        ),
       });
       }).catch((error) =>{
        console.error(error);
        return error;
      });
       
        
    }
    
    
   this.setState({isLoading:false})  
  }
}
_submatch=()=>{
  // 감독경기 매치정보 조회
  if(!this.isLoading){
  this.setState({isLoading:true})  
  fetch("https://api.nexon.co.kr/fifaonline4/v1.0/users/"+this.state.id+"/matches?matchtype=52&limit=20"
  ,{headers: {Authorization:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiNTUzOTA0ODEwIiwiYXV0aF9pZCI6IjIiLCJ0b2tlbl90eXBlIjoiQWNjZXNzVG9rZW4iLCJzZXJ2aWNlX2lkIjoiNDMwMDExNDgxIiwiWC1BcHAtUmF0ZS1MaW1pdCI6IjIwMDAwOjEwIiwibmJmIjoxNTcyNjkzOTU3LCJleHAiOjE2MzU3NjU5NTcsImlhdCI6MTU3MjY5Mzk1N30.Vgey-uDJYTTrROKq6_RSJlSjK0Q6DbZ2mIgyCxrTDKQ"},})
  .then(response => response.json())
  .then((json) => {
     this.setState({
      match_ids: json,
     });
     }).catch((error) =>{
      console.error(error);
      return error;
    });
    
    this.state.match_details = []
   
   for(var t =0; t< this.state.match_ids.length;t++){
     fetch("https://api.nexon.co.kr/fifaonline4/v1.0/matches/"+this.state.match_ids[t]
     ,{headers: {Authorization:"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50X2lkIjoiNTUzOTA0ODEwIiwiYXV0aF9pZCI6IjIiLCJ0b2tlbl90eXBlIjoiQWNjZXNzVG9rZW4iLCJzZXJ2aWNlX2lkIjoiNDMwMDExNDgxIiwiWC1BcHAtUmF0ZS1MaW1pdCI6IjIwMDAwOjEwIiwibmJmIjoxNTcyNjkzOTU3LCJleHAiOjE2MzU3NjU5NTcsImlhdCI6MTU3MjY5Mzk1N30.Vgey-uDJYTTrROKq6_RSJlSjK0Q6DbZ2mIgyCxrTDKQ"},})
     .then(response => response.json())
     .then((json) => {
     this.setState({
       match_details : this.state.match_details.concat(
         [[
       json.matchDate,
       json.matchInfo[0].nickname,
       json.matchInfo[0].matchDetail.matchResult,
       json.matchInfo[1].nickname,
       json.matchInfo[1].matchDetail.matchResult,
       json.matchInfo[0].shoot.goalTotal,
       json.matchInfo[1].shoot.goalTotal,
       this.state.match_ids[t],
     ]]
       ),
      });
      }).catch((error) =>{
       console.error(error);
       return error;
     });
      
       
   }
   
   
  this.setState({isLoading:false})  
 }
}
  render(){
    

    

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }else{
    return(
      <View style={{flex: 1, paddingTop:20,marginLeft:0}}>
        <View style={{marginTop:15,marginLeft:15}}>
          <Text style={{fontSize:15}}>  닉네임 : {this.state.nick}</Text>
          <Text style={{fontSize:15}}>  레벨 : {this.state.level}</Text>
        </View>
        <View style={{marginTop:15,marginLeft:0}}>
          <Button
          buttonStyle={{borderColor:"black"}}
          titleStyle= {{color:"black"}}
            title="공식경기 기록 조회"
            type="outline"
            onPress={this._mainmatch}
          />
          <Button
          buttonStyle={{borderColor:"black"}}
          titleStyle= {{color:"black"}}
            title="감독모드 기록 조회"
            type="outline"
            onPress={this._submatch}
          />
        
        
        </View>
        <ScrollView >
          <View style={styles.container,{marginTop:19}}>
            <FlatList 
              data = {this.state.match_details} 
              
              renderItem = {this._press}

              keyExtractor={(item,index)=>{return `${index}`}}
            />
          </View>
        </ScrollView>

      </View>
    );
    }
  }
}

const AppNavigator = createStackNavigator({
  Home: {
    screen: App,
    navigationOptions: {
      header: null,
    },
  },
  Prof: {
    screen:Profile,
    navigationOptions: {
      headerStyle:{
        backgroundColor:"snow",
      }
    }
  }
});
  
  

const styles = StyleSheet.create({
  container: {
  flex: 1,
  textAlign:"center",
  alignContent:"center",
  alignItems:"center",
  },
  search:{
    margin:0,
    backgroundColor:"black",
    borderBottomLeftRadius:15,
    borderBottomRightRadius:15,
  },
  lineContainer: {
    flexDirection:'row',
    justifyContent:'space-between', //가로 정렬하는데 compo사이를 균등하게 space로 구분
    alignItems:'center', //세로정렬
  },
});
export default createAppContainer(AppNavigator);
