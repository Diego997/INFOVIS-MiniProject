const updateTime = 800; // time for transitions
const margin = {top: 20, right: 20, bottom: 30, left: 40};
const width = 800 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;
var dataSet = [];


var xScale = d3.scaleBand().rangeRound([2, width-60]).padding(.1);

var yScale = d3.scaleLinear().range([height, 0]);

var yColorScale = d3.scaleLinear().range([height, 0]);

var barColors = d3.scaleLinear().range(["blue","red"]);

var xAxis = d3.axisBottom(xScale).tickValues([]);  		// Bottom = ticks below
var yAxis = d3.axisLeft(yScale).ticks(10);
var legendAxis = d3.axisRight(yColorScale).ticks(10);// Left = ticks on the left

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)     // i.e., 800 again 
    .attr("height", height + margin.top + margin.bottom)   // i.e., 300 again
    .append("g")                                           // g is a group
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var linearGradient = svg.append("linearGradient")
    .attr("id","linear-gradient");
    linearGradient
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%");
    //Set the color for the start (0%)
    linearGradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", "red");

    //Set the color for the end (100%)
    linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "blue");


function updateXScaleDomain() {
    xScale.domain(dataSet.map(function(d) { return dataSet.indexOf(d)}));
}

function updateYScaleDomain(){
    yScale.domain([0, d3.max(dataSet, function(d) { return d[1]; })]);
}

function updateColorScaleDomain(){
    barColors.domain([0, d3.max(dataSet, function(d) { return d[0]; })]);
}

function updateYColorScaleDomain(){
    yColorScale.domain([0, d3.max(dataSet, function(d) { return d[0]; })]);
}

function updateAxes(){
    // ".y.axis" selects elements that have both classes "y" and "axis", that is: class="y axis"
    svg.select("g.y.axis").transition().duration(updateTime).call(yAxis);
    svg.select("g.x.axis").transition().duration(updateTime).call(xAxis);
}

function drawAxes(){
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);
}

function drawLegend(){
    svg.append("rect")
        .attr("width", 15)
        .attr("height", 250)
        .attr("x", 685)
        .style("fill", "url(#linear-gradient)")

    svg.append("g")
        .attr("class", "legend")
        .attr("transform", "translate(700)")
        .call(legendAxis);

}

function updateLegend(){
    svg.selectAll("g.legend").transition().duration(updateTime).call(legendAxis);
}

function updateDrawing(){
    var bars = svg.selectAll(".bar").data(dataSet, function(d){return d});

    bars.exit().remove();

    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(dataSet.indexOf(d)); })
        .attr("y", function(d) { return yScale(d[1]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d[1]); })
        .attr("fill", function(d) { return barColors(d[0]);})
        .on("click", handleClick)

    bars.transition().duration(updateTime)
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(dataSet.indexOf(d)); })
        .attr("y", function(d) { return yScale(d[1]); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d[1]); })
        .attr("fill", function(d) { return barColors(d[0]);})
        .on("click", handleClick)

function sliceSVG(rect){
        console.log(rect)
    var newRect = rect.getAttribute("x")
    newRect=newRect-9
    newRect=newRect/67
    console.log(newRect)
    return newRect
}

function handleClick() {
    var elem=dataSet[sliceSVG(this)]
    console.log(elem)
    var swap1=elem[0]
    var swap2=elem[1]
    elem[1]=swap1
    elem[0]=swap2
    console.log(elem)
    updateYScaleDomain(dataSet);
    updateXScaleDomain(dataSet);
    updateYScaleDomain(dataSet);
    updateColorScaleDomain(dataSet);
    updateYColorScaleDomain(dataSet)
    updateLegend();
    updateAxes();
    updateDrawing();

}

}

function redraw(data) {
    updateXScaleDomain(data);
    updateYScaleDomain(data);
    updateColorScaleDomain(data);
    updateAxes();
    updateDrawing(data);
}


d3.json("data/1.json")
	.then(function(data) {
        data.forEach(row => {
            arr = Object.getOwnPropertyNames(row).map(function(e) {return row[e];});
            dataSet.push(arr);
        });
        console.log(dataSet);
        updateYScaleDomain(data);
        updateXScaleDomain(data);
        updateColorScaleDomain(data);
        updateYColorScaleDomain(data)
        drawLegend();
        drawAxes();
    	updateDrawing(data);

   	})
	.catch(function(error) {
		console.log(error); // Some error handling here
  	});

