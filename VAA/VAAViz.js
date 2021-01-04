/* ----------------------------------------------------------------------------
File: MutilineChart.js
Contructs the Multi Line chart using D3
80 characters perline, avoid tabs. Indet at 4 spaces.
-----------------------------------------------------------------------------*/ 

//code to set the margins for the chart and defines margin variables
var margin = {top: 20, right: 80, bottom: 30, left: 70},
    //make the width variable for the chart and the height variable according to the margins
    width = 1500 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;


//create the svg and append to svg variable to call again later and put it in body section of html
var svg = d3.select("body").append("svg")
    //setting the width and height attributes of the svg using the marging vars defined above
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    //use .append("g") to append all svg elements to the DOM
    .append("g")
    //translate the svg by the margins
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

d3.csv("distances.csv").then(function(data){
  var scale = d3.scaleLinear().range([0, 1000]).domain([0, 1]);
  
  var axisD = d3.axisBottom().scale(scale).ticks(1).tickSize(30);
  var axisDTop = d3.axisTop().scale(scale).ticks(1).tickSize(30).tickFormat("");
  
  var length = 125;
  var labelX = 150;
  var dotOffset = 130;
  var labelPos = 175;
  var arrowLabelPos = 160;
  data.forEach(function(d, i){
    if(d.Name == "FILL"){
      length = 75;
      dotOffset = 70;
      labelX = 150;
      labelPos = 25;
      arrowLabelPos = 30;
    } else {
      var coalitions = svg.append("line")
        .attr("x1", scale(d.Distance))
        .attr("y1", 100)
        .attr("x2", (scale(d.Distance)))
        .attr("y2", length)
        .style("stroke-width", "1")
        .style("stroke", "black");
      var dots = svg.append("circle")
        .attr("cx", scale(d.Distance))
        .attr("cy", dotOffset)
        .attr("r", 3.5)
        .style("fill", "black");

      var labels = svg.append("text")
        .attr("class", "labels")
        .attr("x", labelX)
        .attr("y", labelPos)
        .text(d.Name);

      var arrows = svg.append("line")
        .attr("class", "arrows")
        .attr("x1", labelX)
        .attr("y1", arrowLabelPos)
        .attr("x2", (scale(d.Distance)))
        .attr("y2", dotOffset)
        .style("stroke-width", "1")
        .style("stroke", "black");
            
      console.log(d.Name);
      labelX += 100;
    }
  
  });
  
   var vizLine = svg.append("g")
        .attr("class", "D-axis")
        .attr("transform", "translate(150, 100)")
        .call(axisD);
  
  vizLine.append("text")
    .text("User")
    .attr("fill", "black")
    .attr("transform", "rotate(-90)")
    .attr("y", "-10px")
    .style("font-size", 15);
  
  var vizLineTop = svg.append("g")
        .attr("class", "D-axis-Top")
        .attr("transform", "translate(150, 100)")
        .call(axisDTop);
  
})

//create the svg and append to svg variable to call again later and put it in body section of html
var svg2 = d3.select("body").append("svg")
    //setting the width and height attributes of the svg using the marging vars defined above
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    //use .append("g") to append all svg elements to the DOM
    .append("g")
    //translate the svg by the margins
    .attr("transform", "translate(" + (margin.left) + "," + (margin.top+height) + ")");

d3.json("weights.json").then(function(graph){
  console.log(graph);
  
  var graphLayout = d3.forceSimulation(graph.nodes)
    .force("charge", d3.forceManyBody().strength(-20000))
    .force("center", d3.forceCenter(width/2, -(height/2)))
    .force("link", d3.forceLink(graph.links).id(function(d) {return d.id;}).distance(function(d) { console.log(d.value*100); return d.value*100}).strength(1.5))
    .on("tick", ticked);
  
  var link = svg2.append("g").attr("class", "links")
    .selectAll("line")
    .data(graph.links)
    .enter()
    .append("line")
    .attr("stroke", "#aaa")
    .attr("stroke-width", "1px");

  var node = svg2.append("g").attr("class", "nodes")
    .selectAll("g")
    .data(graph.nodes)
    .enter()
    .append("ellipse")
    .attr("rx", 40)
    .attr("ry", 30)
    .style("stroke", "black")
    .style("fill", function(d) { if(d.group == 1){ return "#ECFBFC" } else if(d.group == 2){ return "#ffebd9"} else return "#ffc8bd"});
    
  var labels = svg2.append("g")
    .selectAll("text")
    .data(graph.nodes)
    .enter()
    .append("text")
    .attr("transform", function(node) { console.log(node);
      return "translate(" + node.x-30 + "," + node.y + ")";
    })
    .text(function(node){ return node.id;})
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .style("font-size", 20);
  
  node.call(
    d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
  );
  
  d3.selectAll("input").on("change", function(){
    console.log(this.value)
    focus(this.value)
  });
  
  function ticked() {
    node.call(updateNode);
    link.call(updateLink);
    labels.call(updateLabels);
  }
  
  function fixna(x) {
    if (isFinite(x)) return x;
    return 0;
  }
  
  function updateLink(link) {
    link.attr("x1", function(d) { return fixna(d.source.x); })
        .attr("y1", function(d) { return fixna(d.source.y); })
        .attr("x2", function(d) { return fixna(d.target.x); })
        .attr("y2", function(d) { return fixna(d.target.y); });
  }

  function updateNode(node) {
    node.attr("transform", function(d) {
        return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
    });
  }
  
  function updateLabels(labels) {
    labels.attr("transform", function(d) {
        return "translate(" + fixna(d.x) + "," + fixna(d.y) + ")";
    });
  }
  
  function dragstarted(d) {
    d3.event.sourceEvent.stopPropagation();
    if (!d3.event.active) graphLayout.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
  }

  function dragended(d) {
      if (!d3.event.active) graphLayout.alphaTarget(0);
      d.fx = null;
      d.fy = null;
  }
  
  function focus(code) {
       //set a node opacity to 1 if it is the same as input zip code and 0.1 if not
        node.style("opacity", function(o) {
            //check if node has the right zip
            return o.group == code ? 0.3 : 1;
        });
        //if link is connected to node with correct zip keep if not blur
        link.style("opacity", function(o) {
            return o.source.group == code || o.target.group == code ? 0.3 : 1;
        });
        labels.style("opacity", function(o) {
            //check if node has the right zip
            return o.group == code ? 0.3 : 1;
        });
      
  }
})