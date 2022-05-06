const updateTime = 800; // time for transitions
const margin = {top: 20, right: 20, bottom: 30, left: 40};
const width = 1200 - margin.left - margin.right;
const height = 600 - margin.top - margin.bottom;
const ldmargin = 100;
const nBars=10;
const posFirstBar=(width/nBars/10)+2;
const posOtherBars=(width-2)/nBars;
const posLegend = {from: Math.trunc((posOtherBars*2)+(posFirstBar)+(posOtherBars/2))-5, to: Math.trunc((posOtherBars*7)+(posFirstBar)+(posOtherBars/2))-9};

var dataSet = [];
var xScale = d3.scaleBand().rangeRound([2, width]).padding(.1);
var yScale = d3.scaleLinear().range([height-ldmargin, 0]);
var legendScale = d3.scaleLinear().range([posLegend.from, posLegend.to]);
var barColors = d3.scaleLinear().range(["#2c7bb6", "#00a6ca","#00ccbc","#90eb9d","#ffff8c",
    "#f9d057","#f29e2e","#e76818","#d7191c"]);
var yAxis = d3.axisLeft(yScale).ticks(10);
var legendAxis = d3.axisBottom(legendScale).ticks(10);// Left = ticks on the left

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)     // i.e., 800 again 
    .attr("height", height + margin.top + margin.bottom)   // i.e., 300 again
    .append("g")                                           // g is a group
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

function updateXScaleDomain() {
    xScale.domain(dataSet.map(function(d) { return dataSet.indexOf(d)}));
}

function updateYScaleDomain(){
    yScale.domain([0, d3.max(dataSet, function(d) { return d[1]; })]);
}

function updateColorScaleDomain(){
    var max=d3.max(dataSet, function(d){ return d[0];})
    barColors.domain([0,max*1/8,max*2/8,max*3/8,max*4/8,max*5/8,max*6/8,max*7/8,max]);
}

function updateLegendScaleDomain(){
    legendScale.domain([0, d3.max(dataSet, function(d) { return d[0]; })]);
}

function updateAxes(){
    svg.select("g.y.axis").transition().duration(updateTime).call(yAxis);
    svg.select("g.legend").transition().duration(updateTime).call(legendAxis);
}

function drawAxes(){

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(0," + (height-(width*25/height)+30)+")")
        .call(legendAxis);
}

function drawLegend(){
    var linearGradient = svg.append("linearGradient")
        .attr("id","linear-gradient");
    linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "100%")
        .attr("y2", "0%");

    linearGradient.selectAll("stop")
        .data([
            {offset: "0%", color: "#2c7bb6"},
            {offset: "12.5%", color: "#00a6ca"},
            {offset: "25%", color: "#00ccbc"},
            {offset: "37.5%", color: "#90eb9d"},
            {offset: "50%", color: "#ffff8c"},
            {offset: "62.5%", color: "#f9d057"},
            {offset: "75%", color: "#f29e2e"},
            {offset: "87.5%", color: "#e76818"},
            {offset: "100%", color: "#d7191c"}
        ])
        .enter().append("stop")
        .attr("offset", function(d) { return d.offset; })
        .attr("stop-color", function(d) { return d.color; });

    svg.append("rect")
        .attr("width", posLegend.to-posLegend.from)
        .attr("height", 30)
        .attr("x", posLegend.from)
        .attr("y", height-(width*25/height))
        .style("fill", "url(#linear-gradient)")
}

function updateDrawing(){
    var bars = svg.selectAll(".bar").data(dataSet, function(d){return d});

    bars.exit().remove();

    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(dataSet.indexOf(d)); })
        .attr("y", function(d) { return yScale(d[1]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height-ldmargin - yScale(d[1]); })
        .attr("fill", function(d) { return barColors(d[0]);})
        .on("click", handleClick)

    bars.transition().duration(updateTime)
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(dataSet.indexOf(d)); })
        .attr("y", function(d) { return yScale(d[1]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height-ldmargin - yScale(d[1]); })
        .attr("fill", function(d) { return barColors(d[0]);})

}

function formSVGtoIndex(rect){
    var x = rect.getAttribute("x")
    x=Math.round((x-Math.trunc(posFirstBar))/posOtherBars)
    return x
}

function handleClick() {
    var elem=dataSet[formSVGtoIndex(this)]
    var swap1=elem[0]
    var swap0=elem[1]
    elem[1]=swap1
    elem[0]=swap0
    redraw();
}

function redraw() {
    updateYScaleDomain();
    updateColorScaleDomain();
    updateLegendScaleDomain();
    updateAxes();
    updateDrawing();
}


d3.json("data/dataset.json")
	.then(function(data) {
        data.forEach(row => {
            arr = Object.getOwnPropertyNames(row).map(function(e) {return row[e];});
            dataSet.push(arr);
        });
        updateYScaleDomain();
        updateXScaleDomain();
        updateColorScaleDomain();
        updateLegendScaleDomain()
        drawLegend();
        drawAxes();
    	updateDrawing();
   	})
	.catch(function(error) {
		console.log(error); // Some error handling here
  	});

