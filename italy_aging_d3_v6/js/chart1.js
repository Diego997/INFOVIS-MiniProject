const updateTime = 800; // time for transitions
const margin = {top: 20, right: 20, bottom: 30, left: 40};
const width = 800 - margin.left - margin.right;
const height = 300 - margin.top - margin.bottom;
var dataSet = [];

var xScale = d3.scaleBand()
        .rangeRound([2, width-60])
	.padding(.1);

var yScale = d3.scaleLinear().range([height, 0]);

var yColorScale = d3.scaleLinear().range([height, 0]);

var barColors = d3.scaleLinear().range(["blue","red"]);

var xAxis = d3.axisBottom(xScale);  		// Bottom = ticks below
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
        .attr("stop-color", "blue");

    //Set the color for the end (100%)
    linearGradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", "red");


// Parameter data is the object containing the values for a specific year
// it has two fields: data.year (a number) and data.ageGroups (an array).
// Each element d of data.ageGroups[] has d.ageGroup (for example "0-4") and  
// d.population (a number)
//
function updateXScaleDomain(data) {
    var values = data;
    xScale.domain(values.map(function(d) { return d.ageGroup}));
}

function updateYScaleDomain(data){
    var values = data;
    yScale.domain([0, d3.max(values, function(d) { return d.population; })]);
}

function updateColorScaleDomain(data){
    var values = data;
    barColors.domain([0, d3.max(values, function(d) { return d.ageGroup; })]);
}

function updateYColorScaleDomain(data){
    var values = data;
    yColorScale.domain([0, d3.max(values, function(d) { return d.ageGroup; })]);
}

function updateAxes(){
    // ".y.axis" selects elements that have both classes "y" and "axis", that is: class="y axis"
    svg.select(".y.axis").transition().duration(updateTime).call(yAxis);
    svg.select(".x.axis").transition().duration(updateTime).call(xAxis);
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
        .attr("class", "legend axis")
        .attr("transform", "translate(700)")
        .call(legendAxis);

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
        .on("click", function(d) {
            if(mario) {
                mario=0;
                d3.select(this).transition().duration(updateTime)
                    .attr("fill", function (d) {
                        return barColors(d.population);
                    })
                    .attr("height", function (d) {
                        return height - yScale(d.ageGroup);
                    })
                    .attr("y", function (d) {
                        return yScale(d.ageGroup);
                    });
            }
            else{
                mario=1;
                d3.select(this).transition().duration(updateTime)
                    .attr("fill", function (d) {
                        return barColors(d.ageGroup);
                    })
                    .attr("height", function (d) {
                        return height - yScale(d.population);
                    })
                    .attr("y", function (d) {
                        return yScale(d.population);
                    });
            }
        });

    var mario = 1;

}

function redraw(data) {
    updateXScaleDomain(data);
    updateYScaleDomain(data);
    updateColorScaleDomain(data);
    updateAxes();
    updateDrawing(data);
}

//function creaLista(data) {
  //  var list = new List();
    //list.ap
//}

d3.json("data/1.json")
	.then(function(data) {
        data.forEach(row => {
            arr = Object.getOwnPropertyNames(row).map(function(e) {return row[e];});
            dataSet.push(arr);
        });
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

