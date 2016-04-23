# Nodify
Data visualization using the NYT API and Arborjs

Required knowledge:
Javascript, AJAX, Canvas

What you need:

1) New York Times Article Search API: http://developer.nytimes.com/docs/read/article_search_api_v2
2) arbor.js - http://arborjs.org/
3) Jquery

Instructions:

Setting up the API:

1) First step is connecting to your API. Once you have registered your API you should have received a key, which enables you to query the API. Include the API key every time you're app launches a query.

2) The Article Search API takes an array of parameters that can help refine the results of your searches. A typical search query looks like this: 
  
  http://api.nytimes.com/svc/search/v2/articlesearch.response-format?[q=search term&fq=filter-field:(filter-term)&additional-params=values]&api-key=####
  
  The array takes in the search term and applies filters to to it for refined results. In my app I added a filter query to only return results where the search term was found in the headline. See the respective API's documentation for more on filter queries.  
  
3) Create an html input tag and capture it's value into a javascript variable.

4) Place the user's input into the search query and perform an ajax call.

5) If all worked well, you should be receiving an object of about 10 articles related to your search query in JSON format. 

Setting up Arbor:

Arbor is a highly flexible data visualization library that handles the physics of the layout and screen redrawing aspects, and allows you to shape and colour the presentation of data in many ways. While this app uses canvas, arbor can be used with svg or positioned elements as well. 

1) Arbor uses The Particle System to store and handle the positioning and updating of nodes and edges. Create it by calling the constructor: arbor.ParticleSystem(). It also takes a number of parameters that control the repulsion, stiffness, gravity, fps and stepping of the simulation.  A good default is arbor.ParticleSystem(1000,600,0.5,24,0.2).

2) Next arbor needs an object to handle the redrawing and resizing of the particle system. To create it, make a renderer object that contains an init and redraw method which will be called each time a node position changes. See the arbor examples for more detail on how to set it up.

3) The particle system is where we will be feeding and processing our data received from the API. Perform the API and loop through the data.

4) For each item in the data object, add a node using arbor.ParticleSystem().addNode(name, {data}). The name can be anything you want, but for me I used the loop iteration as it's name to keep track of the node for later. The second parameter is a data object that can also be anything you want. For this app I passed in the headline and the thumbnail of the article if it had one.

5) If you want your nodes to connect you can use arbor.ParticleSystem.addEdge("node1","node2")

6) By now your nodes have been created and have the necessary data. But they haven't been drawn yet! This is where the fun really starts. Back in your redraw method of the renderer, use the .eachNode and .eachEdge methods to iterate over each node and edge you created and draw something.

7) Using canvas methods you can draw shapes, circles, labels or whatever you can imagine.


  
  










