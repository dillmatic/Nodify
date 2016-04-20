(function ($) {
    
   

    
    //search box variables
    
    var search = document.querySelector('.search')
    var inputField = document.querySelector('input');
    var input;
    
     //fade the search box in
    
    $('.search').velocity("fadeIn",{duration:1500});

    //rendering the canvas
    var Renderer = function (canvas) {
        var canvas = $(canvas).get(0);
        var ctx = canvas.getContext("2d");
        var particleSystem
        
        var that = {
            init: function (system) {
                
                // the particle system will call the init function once, right before the
                // first frame is to be drawn. it's a good place to set up the canvas and
                // to pass the canvas size to the particle system
                //
                // save a reference to the particle system for use in the .redraw() loop
                particleSystem = system

                // inform the system of the screen dimensions so it can map coords for us.
                // if the canvas is ever resized, screenSize should be called again with
                // the new dimensions
                //        particleSystem.screenSize(canvas.width, canvas.height) 
                //        particleSystem.screenPadding(80) // leave an extra 80px of whitespace per side

                $(window).resize(that.resize)
                that.resize()

                // set up some event handlers to allow for node-dragging
                that.initMouseHandling()
            },

            redraw: function () {
                // 
                // redraw will be called repeatedly during the run whenever the node positions
                // change. the new positions for the nodes can be accessed by looking at the
                // .p attribute of a given node. however the p.x & p.y values are in the coordinates
                // of the particle system rather than the screen. you can either map them to
                // the screen yourself, or use the convenience iterators .eachNode (and .eachEdge)
                // which allow you to step through the actual node objects but also pass an
                // x,y point in the screen's coordinate system
                // 
                ctx.fillStyle = "white"
                ctx.fillRect(0, 0, canvas.width, canvas.height)

                particleSystem.eachEdge(function (edge, pt1, pt2) {
                    // edge: {source:Node, target:Node, length:#, data:{}}
                    // pt1:  {x:#, y:#}  source position in screen coords
                    // pt2:  {x:#, y:#}  target position in screen coords

                    // draw a line from pt1 to pt2
                    ctx.strokeStyle = "rgba(0,0,0, .333)"
                    ctx.lineWidth = 1
                    ctx.beginPath()
                    ctx.moveTo(pt1.x, pt1.y)
                    ctx.lineTo(pt2.x, pt2.y)
                    ctx.stroke()
                })

                particleSystem.eachNode(function (node, pt) {
                    
                    // node: {mass:#, p:{x,y}, name:"", data:{}}
                    // pt:   {x:#, y:#}  node position in screen coordinates
                    
                    pt.x = Math.floor(pt.x);
                    pt.y = Math.floor(pt.y);
                    
                    //Grabbing the headline data from the node and drawing a text label

                    var w = ctx.measureText(node.data.headline || "").width + 6
                    var label = node.data.headline;
                    if (!(label || "").match(/^[ \t]*$/)) {
                        pt.x = pt.x;
                        pt.y = pt.y;
                    } else {
                        label = null;
                    }

                    //drawing the origin node

                    if (node.name == "origin") {
                        // get it's title
//                        var w = ctx.measureText(node.data.headline || "").width + 6
                        var label = node.data.headline;
                        if (!(label || "").match(/^[ \t]*$/)) {
                            pt.x = pt.x;
                            pt.y = pt.y;
                            
                        //draw the circle
                            ctx.arc(pt.x, pt.y, w, 0, Math.PI * 2, false);
                            ctx.fillStyle = "white";
                            ctx.fill();
                            
                        //make the title into a label
                            ctx.font = "bold 24px Arial";
                            ctx.textAlign = "center";
                            ctx.fillStyle = "red";
                            ctx.fillText(label || "", pt.x, pt.y+10);
                            
                        }
                    }
                    
                    //REGULAR NODES
                    
                    //If the node has an image...

                    if (node.data.image != undefined) {
                        
                        //drawn the circle
                        ctx.save();
                        ctx.beginPath();
                        ctx.arc(pt.x, pt.y, 35, 0, Math.PI * 2, false);
                        ctx.lineWidth = 10;
                        ctx.strokeStyle = "white";
                        ctx.stroke();
                        ctx.clip();
                        ctx.drawImage(node.data.image, pt.x-35, pt.y-35);
                        ctx.restore();
                        
                        //add text
                        ctx.font = "bold 12px Arial";
                        ctx.textAlign = "center";
                        ctx.fillStyle = "black";
                        ctx.fillText(label || "", pt.x, pt.y -50 )
                        
                    } else if (node.data.image == undefined && node.name !== "origin") {
                        
                        //draw a blue circle
                        ctx.beginPath();
                        ctx.arc(pt.x, pt.y, 15, 0, Math.PI * 2, false);
                        ctx.fillStyle = "blue";
                        ctx.fill();
                        
                        //add the label
                        ctx.font = "bold 12px Arial";
                        ctx.textAlign = "center";
                        ctx.fillStyle = "black";
                        ctx.fillText(label || "", pt.x, pt.y -25 );

                    }
                })
            },

            resize: function () {
                var w = $(window).width(),
                    h = $(window).height();
                canvas.width = w;
                canvas.height = h // resize the canvas element to fill the screen
                particleSystem.screenSize(w, h) // inform the system so it can map coords for us
                particleSystem.screenPadding(150, 100, 100, 100);
                that.redraw();
            },


            initMouseHandling: function () {
                // no-nonsense drag and drop (thanks springy.js)
                var dragged = null;

                // set up a handler object that will initially listen for mousedowns then
                // for moves and mouseups while dragging
                var handler = {
                    clicked: function (e) {
                        
                        var pos = $(canvas).offset();
                        _mouseP = arbor.Point(e.pageX - pos.left, e.pageY - pos.top)
                        dragged = particleSystem.nearest(_mouseP);
                        
                        if(dragged == null) return
                                                                 
                        if(dragged.node.name == "origin"){
                            
                            //show the search box if 
                            if($('.search').css("display") != "block"){
                                $('.search').velocity("fadeIn",{duration:1000});
                            }
                            
                            
                            
                            
                        }

                        if (dragged && dragged.node !== null) {
                            // while we're dragging, don't let physics move the node
                            dragged.node.fixed = true;
                        }


                        $(canvas).bind('mousemove', handler.dragged)
                        $(window).bind('mouseup', handler.dropped)

                        return false
                    },
                    
                    dragged: function (e) {
                        var pos = $(canvas).offset();
                        var s = arbor.Point(e.pageX - pos.left, e.pageY - pos.top)

                        if (dragged && dragged.node !== null) {
                            var p = particleSystem.fromScreen(s)
                            dragged.node.p = p

//                            console.log(dragged.node)
                        }

                        return false
                    },

                    dropped: function (e) {
                        if (dragged === null || dragged.node === undefined) return
                        if (dragged.node !== null) dragged.node.fixed = false


                        dragged.node.tempMass = 1000
                        dragged = null
                        $(canvas).unbind('mousemove', handler.dragged)
                        $(window).unbind('mouseup', handler.dropped)
                        _mouseP = null
                        return false
                    },

                    openLink: function (e) {


                        var pos = $(canvas).offset();
                        _mouseP = arbor.Point(e.pageX - pos.left, e.pageY - pos.top)
                        dragged = particleSystem.nearest(_mouseP);

                        if (dragged && dragged.node !== null) {
                            // while we're dragging, don't let physics move the node                    
                            window.open(dragged.node.data.url, '_blank');
                            dragged.node.fixed = true;
                        }

                    }
                }

                // start listening
                $(canvas).mousedown(handler.clicked);
                $(canvas).dblclick(handler.openLink);

            },

        }
        return that
    }

    $(document).ready(function () {
        
        // create the system 
        var sys = arbor.ParticleSystem() 
        
        //with sensible repulsion/stiffness/friction
        sys.parameters({
            stiffness:100,
            precision:1,
            gravity: true
            })
        sys.renderer = Renderer("#viewport") // our newly created renderer will have its .init() method called shortly by sys...
        
        
        //Pressing enter to trigger the ajax call

        inputField.addEventListener('keydown', function (e) {
            

            if (e.keyCode == 13) {
            
                
                $('.search').velocity("fadeOut",{duration:1000});
                
                sys.eachNode(function(node,pt){
                   sys.pruneNode(node);
                });
                    
                

                input = document.querySelector('input').value;
                
                inputField.value = "";

                if (input == "") {
                    return
                } else {
                    
                    //run the ajax call to the NYT article search
                    $.ajax({
                        url: "http://api.nytimes.com/svc/search/v2/articlesearch.json?q=" + input + "&fq=headline:" + input + "& document_type:article&fl=headline,multimedia,web_url,pub_date&api-key=de0f5e3d0cd94130d6089f9185cf9013:17:74660763",

                    }).done(function (data) {    
                        
                        console.log(data);

                       //make the origin node with a label of the search query
                        
                        if( data.response.docs.length == 0){
                            console.log("no results!");
                            sys.addNode("origin",{
                            "headline": "no results!" 
                            });
                            
                            return
                            
                        } else {
                            
                            sys.addNode("origin", {
                            "headline": input,
                            fixed: true

                            });

//                            console.log(sys.getNode("origin"));

                            var obj = data.response.docs;

                            for(var i = 0; i < obj.length; i++) {

                                //console.log("making a node!");

                                sys.addNode("'" + i + "'", {
                                    "headline": obj[i].headline.main,
                                    "image":(function(){
                                        if(obj[i].multimedia.length !=0 ){

                                            var img = new Image();
                                            var thumbnail;

                                            for (var j = 0; j < obj[i].multimedia.length; j++) {
                                                if (obj[i].multimedia[j].subtype == "thumbnail") {

                                                    //console.log("found thumbnail");

                                                    img.src = "https://static01.nyt.com/" + obj[i].multimedia[j].url;

                                                    return img

                                                }
                                            }

                                        } else {
                                        //console.log("no media");  
                                            return
                                        }
                                    }()),

                                    "url": obj[i].web_url,
                                    "year": (function(){
                                        if(obj[i].pub_date != null)
                                        return obj[i].pub_date.substring(0,4)
                                    }()),
                                })

                                    sys.addEdge("origin", "'" + i + "'", {
                                        "length": .5
                                    })

    //                                console.log(sys.getNode("'"+i+"'"))      
                            }

    //                        console.log("success");

                        }

                    }).fail(function () {
                        console.log("fail");
                    })


                }

            }
        });

    })


    function windowToCanvas(canvas, x, y) {
        var bbox = canvas.getBoundingClientRect();

        return {
            x: x - bbox.left * (canvas.width / bbox.width),
            y: y - bbox.top * (canvas.height / bbox.height)
        };
    }

})(this.jQuery)