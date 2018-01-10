import React, { Component } from 'react';
import Chart from 'chart.js';

class LineChart extends Component {
  constructor(props){
    super(props);

    this.makeChartData = this.makeChartData.bind(this);
    this.defaultStyle = this.defaultStyle.bind(this);
    this.selectColor = this.selectColor.bind(this);
    this.drawScore = this.drawScore.bind(this);
    
    this.canvasChart = null;
    this.chartController = null;
    this.data = {};
  }
  options = {
    legend: {
      display: true,
      position: 'bottom',
      labels:{
        fontFamily:'"Helvetica Neue", Helvetica, Arial, sans-serif',
        fontSize:12,
        usePointStyle:true,
      },
      onClick:(e)=>{
        e.stopPropagation();
      }
    },
    pointStyle:'circle',
    animation: {
      duration: 0, // general animation time,
      onComplete:()=>{}
    },
    hover: {
      animationDuration: 0, // duration of animations when hovering an item
      mode: null
    },
    responsiveAnimationDuration: 0, // animation duration after a resize,
    tooltips: {enabled: false},
    layout: {
      padding:{
        left:0,
        right:0,
        top:0,
        bottom:0
      }   
    },
    scales:{
      xAxes: [{
        ticks:{
          fontSize:12,
          fontColor:'#000000',
        },
        gridLines: {
          drawOnChartArea:true,
          borderDash: [3, 3],
          borderDashOffset:10,
          tickMarkLength:10,
          zeroLineBorderDashOffset:5,
          drawTicks:true,
          zeroLineWidth:0,
          offsetGridLines:false
          //color: "#757575"
        }
      }],
      yAxes: [{
        display: false, 
        weight:0,
      }],
    },
    // onHover:(e)=>{
    //   e.stopPropagation();
    // },
    events:[]
  }

  defaultStyle(){
    return {
      fill: false,
      lineTension:0,
      pointBorderWidth:6,
      pointRadius:6,
      borderWidth:3,
      pointHitRadius:0,
      pointStyle:'circle',
    }
  }

  selectColor(index){
    let colorArr = ['#d072ea','#4ed8db','#f4df24'];
    return {
      backgroundColor:colorArr[index],
      borderColor:colorArr[index],
      pointBackgroundColor:colorArr[index],
      pointBorderColor:colorArr[index],
    }
  }

  makeChartData(){
    //test data
    this.data.labels= ['2018.01', '2018.02', '2018.03','2018.04','2018.05','2018.06'];
    this.data.datasets = [];

    this.data.datasets.push({
      label: "korean",
      data: [70, 88, 92, 85, 94, 85],
      ...this.selectColor(0),
      ...this.defaultStyle()
    })

    this.data.datasets.push({
      label: "math",
      data: [35, 55, 79, 60, 80, 77],
      ...this.selectColor(1),
      ...this.defaultStyle()
    })

    this.data.datasets.push({
      label: "english",
      data: [55, 79, 60, 80, 70, 65],
      ...this.selectColor(2),
      ...this.defaultStyle()
    })

    return {
      type:'line',
      data:this.data,
      options:this.options
    }
  }

  drawScore(){
    let ctx = this.chartController.ctx;
    ctx.fillStyle = '#ffffff';
    ctx.font = '11px "Helvetica Neue", Helvetica, Arial, sans-serif';
    
    this.chartController.data.datasets.forEach((dataset)=>{
      for (let i = 0; i < dataset.data.length; i++) {
        let model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
        ctx.textAlign="center"; 
        ctx.textBaseline="middle"; 
        ctx.fillText(dataset.data[i], model.x, model.y);
      }
    });
  }

  componentDidMount(){
    let ctx = this.canvasChart.getContext("2d");
    this.chartController = new Chart(ctx, this.makeChartData());
    this.drawScore();
  }

  render() {
    const {height=254, id} = this.props;
    let width = window.innerWidth - 30;
    return (
      <div style={{width:width, height:280, backgroundColor:'#f1f1f1', paddingTop:20}}>
        <canvas id={id} width={width} height={height} ref={(ref)=>{this.canvasChart = ref}}></canvas>
      </div>
    );
  }
}

export default LineChart;