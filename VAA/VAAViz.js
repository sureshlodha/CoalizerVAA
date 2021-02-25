/* ----------------------------------------------------------------------------
File: MutilineChart.js
Contructs the Multi Line chart using D3
80 characters perline, avoid tabs. Indet at 4 spaces.
-----------------------------------------------------------------------------*/ 

//code to set the margins for the chart and defines margin variables
var margin = {top: 20, right: 80, bottom: 30, left: 70},
    //make the width variable for the chart and the height variable according to the margins
    width = 1500 - margin.left - margin.right,
    height = 245 - margin.top - margin.bottom;


//create the svg and append to svg variable to call again later and put it in body section of html
var svg = d3.select("body").append("svg")
    .attr("class", "svg")
    //setting the width and height attributes of the svg using the marging vars defined above
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    //use .append("g") to append all svg elements to the DOM
    .append("g")
    //translate the svg by the margins
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

d3.csv("distances.csv").then(function(data){
  var scale = d3.scaleLinear().range([0, 1000]).domain([0, 1]);
  console.log(scale(0.5));
  var axisD = d3.axisBottom().scale(scale).ticks(1).tickSize(30);
  var axisDTop = d3.axisTop().scale(scale).ticks(1).tickSize(30).tickFormat("");
  var axisTicks = d3.axisTop().scale(scale).tickValues([0.2, 0.5, 0.7]);
  
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
        .style("fill", "black")
        .on("mouseover", function(){
        tooltip.transition()
        .duration(200)
        .style("opacity", 1);
        tooltip.html("<p>" + d.Distance + "</p>")
        .style("top", (d3.event.pageY+10) + "px")		
        .style("left", (d3.event.pageX) + "px");	
      })
      .on("mouseout", function(d){
          tooltip.transition()
              .duration(200)
              .style("opacity", 0); 
      }); 
      
      var labels = svg.append("text")
        .attr("class", "labels")
        .attr("x", labelX)
        .attr("y", labelPos)
        .text(d.Name + "(" + parseFloat(d.Distance).toFixed(2) +")");

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
        .attr("transform", "translate(0, 100)")
        .call(axisD);
  
  vizLine.append("text")
    .text("User")
    .attr("fill", "black")
    .attr("transform", "rotate(-90)")
    .attr("y", "-10px")
    .style("font-size", 15);
  
  var vizLineTop = svg.append("g")
        .attr("class", "D-axis-Top")
        .attr("transform", "translate(0, 100)")
        .call(axisDTop);
  
  var vizLineTicks = svg.append("g")
        .attr("class", "D-axis")
        .attr("transform", "translate(0, 100)")
        .call(axisTicks);
  
  var partyLabel = svg.append("text")
    .attr("x", 0)
    .attr("y", 25)
    .text("Single Parties ------>");
  
  var coalitionLabel = svg.append("text")
    .attr("x", 0)
    .attr("y", 175)
    .text("Coalitions ------>");
  
})

//create the svg and append to svg variable to call again later and put it in body section of html
var svg2 = d3.select("body").append("svg")
    .attr("class", "svg2")
    //setting the width and height attributes of the svg using the marging vars defined above
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom+200)
    //use .append("g") to append all svg elements to the DOM
    .append("g")
    //translate the svg by the margins
    .attr("transform", "translate(" + (margin.left) + "," + (margin.top+height+100) + ")");

var tickerSemaphore = -2;
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
    .style("fill", function(d) { if(d.group == 1){ return "#ECFBFC" } else if(d.group == 2){ return "#ffebd9"} else return "#ffc8bd"})
    .on("click", function(d){ distanceFocus(d)});
    
  var labels = svg2.append("g")
    .selectAll("text")
    .data(graph.nodes)
    .enter()
    .append("text")
    .attr("transform", function(node) { console.log(node);
      return "translate(" + node.x-30 + "," + node.y + ")";
    })
    .text(function(node){ if(node.id != "User"){return node.id + "(" + parseFloat(node.distance).toFixed(2) + ")"} else return node.id;})
    .attr("fill", "black")
    .attr("text-anchor", "middle")
    .style("font-size", 17);
  
  node.call(
    d3.drag()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
  );
  
  d3.selectAll("input").on("change", function(){
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
  
  d3.select("#distance").on("change", function(){
    if(d3.select("#distance").property("checked") == false){
      d3.select("#distval").property("value", "No Selections");
      tickerSemaphore = -2;
      focus(-1);
    } else {
      d3.select("#distval").property("value", "Make First Selection");
    }
  })
  
  function distanceFocus(code) {
    if(d3.select("#distance").property("checked") && code.id != "User"){
      if(tickerSemaphore == -2){
        firstID = code.id;
        tickerSemaphore = tickerSemaphore + 1;
        node.style("opacity", function(o) {
          return o.id == code.id ? 1 : 0.3;
        });

        link.style("opacity", function(o) {
          return o.source.id == code.id || o.target.id == code.id ? 1 : 0;
        });
        d3.select("#distval").property("value", "Make Second Selection");
      } else if (tickerSemaphore == -1){
        if(code.id != firstID){
          tickerSemaphore = tickerSemaphore + 1;
          node.style("opacity", function(o) {
            return (o.id == code.id)||(o.id == firstID) ? 1 : 0.3;
          });

          link.style("opacity", function(o) {
            if((o.source.id == code.id && o.target.id == firstID)||(o.source.id == firstID && o.target.id == code.id)){ weight = o.value;}
            return (o.source.id == code.id && o.target.id == firstID)||(o.source.id == firstID && o.target.id == code.id) ? 1 : 0;
          });
          labels.style("opacity", function(o) {
              return (o.id == code.id)||(o.id == firstID) ? 1 : 0.3;
          });
          d3.select("#distval").property("value", weight);
        }
      } else {
        tickerSemaphore = -2;
        focus(-1)
        d3.select("#distval").property("value", "Make First Selection");
      }
    } else {
      tickerSemaphore = -2;
      focus(-1);
    }
  }
})