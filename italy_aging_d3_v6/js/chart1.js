
    updateTime = 500; // time for transitions

var margin = {top: 20, right: 20, bottom: 30, left: 40}; // to memorize the margins

// screen is 800 x 300
// actual drawing leaves a margin around
// width and height are the size of the actual drawing
//
var width = 800 - margin.left - margin.right;
var height = 300 - margin.top - margin.bottom;

// x is the scale for x-axis
// domain is not given here but it is updated by updateXScaleDomain()
// 
var xScale = d3.scaleBand()         // ordinal scale
        .rangeRound([2, width])    // leaves 10 pixels for the y-axis
	.padding(.1);              // between the bands
                               // x.bandwidth() will give the width of each band

// y is the scale for y-axis
// domain is not given here but it is updated by updateYScaleDomain()
//
var yScale = d3.scaleLinear().range([height, 0]);

var barColors = d3.scaleLinear() // projecting continuous data into the diagram
        .range(["blue","red"])

var xAxis = d3.axisBottom(xScale);  		// Bottom = ticks below
var yAxis = d3.axisLeft(yScale).ticks(10);   // Left = ticks on the left 

var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)     // i.e., 800 again 
    .attr("height", height + margin.top + margin.bottom)   // i.e., 300 again
    .append("g")                                           // g is a group
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");                                                    

// Parameter data is the object containing the values for a specific year
// it has two fields: data.year (a number) and data.ageGroups (an array).
// Each element d of data.ageGroups[] has d.ageGroup (for example "0-4") and  
// d.population (a number)
//
function updateXScaleDomain(data) {
    var values = data;
    xScale.domain(values.map(function(d) { return d.ageGroup}));

    // for example x.domain is initialized with ["0-4", "5-9", "10-14", ... ] 
}

function updateYScaleDomain(data){
    var values = data;
    yScale.domain([0, d3.max(values, function(d) { return d.population; })]);
}

function updateColorScaleDomain(data){
    var values = data;
    barColors.domain([0, d3.max(values, function(d) { return d.population; })]);
}

function updateAxes(){
    // ".y.axis" selects elements that have both classes "y" and "axis", that is: class="y axis"
    svg.select(".y.axis").transition().duration(updateTime).call(yAxis);
    svg.select(".x.axis").transition().duration(updateTime).call(xAxis);
}

function drawAxes(){

    // draw the x-axis
    //
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    // draw the y-axis
    //
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

}

// Parameter data is the object containing the values for a specific year
// it has two fields: data.year (a number) and data.ageGroups (an array).
// Each element d of data.ageGroups[] has d.ageGroup (for example "0-4") and  
// d.population (a number)
//
function updateDrawing(data){

    var values = data;

    // Data join: function(d) is the key to recognize the right bar
    var bars = svg.selectAll(".bar").data(values, function(d){return d.ageGroup});

    // Exit clause: Remove elements
    bars.exit().remove();

    // Enter clause: add new elements
    //
    bars.enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) { return xScale(d.ageGroup); })
        .attr("y", function(d) { return yScale(d.population); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d.population); })
        .attr("fill", function(d) { return barColors(d.ageGroup);})
        .on("mouseover", function(d) {
                d3.select(d)
                .attr("fill", "green");
                })


    // Enter + Update clause: update y and height
    //
    //Da modificare serve per la transizione una volta premuta la barra
    bars.transition().duration(updateTime)
        .attr("x", function(d) { return xScale(d.ageGroup); })
        .attr("y", function(d) { return yScale(d.population); })
        .attr("width", xScale.bandwidth())
        .attr("height", function(d) { return height - yScale(d.population); });


}

function click (d){
    var bar = d3.select(this)
    bar.transition()
        .style('transform', )
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

    	// Drawing axes and initial drawing
    	//
        updateYScaleDomain(data);
        updateXScaleDomain(data);
        updateColorScaleDomain(data);
        drawAxes();
    	updateDrawing(data);

   	})
	.catch(function(error) {
		console.log(error); // Some error handling here
  	});

