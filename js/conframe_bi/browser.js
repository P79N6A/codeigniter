//  ------------------------------------------------------------------------------------ //
//                                  ConFrame-Electric CTM V3                             //
//                               Copyright (c) 2011-2014 DunRose                         //
//                                  <http://www.dunrose.ru/>                             //
//  ------------------------------------------------------------------------------------ //
//  Author: Mr. Thurairajasingam Senthilruban           TSRuban[AT]dunrose.ru            //
//  Programmer: Mr. Kharitonov Constantine Igorevich    CKharitonov[AT]dunrose.ru        //
//  URL: http://www.dunrose.ru                                                           //
// ------------------------------------------------------------------------------------- //

var Browser = {
    'base_url' : null,
    'data' : null,
    'nodes' : null,
    'edges' : null,
    'network' : null,
    'path' : null,
    'basic_elem' : []
};
/*
 * CKharitonov
 */
Browser.init = function(){
    for (var i=0; i<Browser.data.length; i++){
        if (Browser.data[i]["parent"] == 0 || Browser.data[i]["parent"] == null){
            Browser.basic_elem.push(Browser.data[i]);
        }
    }
    html = '<div id="visualization" style="height:'+($(window).height()-30)+'px;background-color:white"></div>';
    html += '<div id="selection" style="height:30px;background-color:white;color:black;font-size:14px;"></div>';
	$('#browser').html(html);
    Browser.load_data();
}
/*
 * CKharitonov
 */
Browser.load_data = function(){
    $("#visualization").empty();
    $("#selection").empty();
    var nodes = new Array();
    var edges = new Array();
    Browser.nodes = new Array();
    Browser.edges = new Array();
    Browser.network = new Array();
    for (var i=0; i<Browser.basic_elem.length; i++){
        nodes.push({
            id: Browser.basic_elem[i]["id"],
            label: Browser.basic_elem[i]["code"],
            title: '<div style="max-width:200px;white-space:pre-wrap;">'+Browser.basic_elem[i]["name"]+'</div>',
            group: Browser.basic_elem[i]["parent"],
            is_open: false
        });
    }
    Browser.nodes = new vis.DataSet(nodes);
    for (var i=0; i<Browser.basic_elem.length; i++){
        var from = Browser.basic_elem[i]["parent"];
        var to = Browser.basic_elem[i]["id"];
        edges.push({
            from: from,
            to: to
        });
    }
    Browser.edges = new vis.DataSet(edges);
    var container = document.getElementById('visualization');
    var data = {
        nodes: Browser.nodes,
        edges: Browser.edges
    };
    var options = {
        nodes: {
            shape: "dot",
            radius: 15,
            fontColor: "black"
        },
        edges: {
            style: "arrow"
        },
        tooltip: {
            delay: 300,
            fontSize: 12,
            color: {
                background: "#BBDEFB"
            }
        },
        physics: {
            barnesHut: {
                enabled: true,
                gravitationalConstant: -7000,
                centralGravity: 0.1,
                springLength: 50,
                springConstant: 0.05,
                damping: 0.1
            }
        },
        stabilize: false,
        smoothCurves: true,
        hover: true
    };
    Browser.network = new vis.Network(container,data,options);
    Browser.network.on('doubleClick',function (properties){
        if (properties.nodes.length != 0){
            if (Browser.nodes["_data"][properties.nodes[0]]["is_open"] == false){
                Browser.add_nodes(properties.nodes[0]);
                Browser.nodes["_data"][properties.nodes[0]]["is_open"] = true;
                setTimeout('Browser.focus_on_node('+properties.nodes[0]+');',1000);
            }
            else {
                Browser.remove_nodes_edges(properties.nodes[0]);
                Browser.nodes["_data"][properties.nodes[0]]["is_open"] = false;
            }
        }
    });
    Browser.network.on('hoverNode',function (properties){
        for (var i=0; i<Browser.data.length; i++){
            if (Browser.data[i]["parent"] == properties.node){
                document.body.style.cursor = 'pointer';
            }
        }
    });
    Browser.network.on('blurNode',function (properties){
        document.body.style.cursor = 'default';
    });
    Browser.network.on('select',function (properties){
        if (properties.nodes.length != 0){
            var select_node = Browser.nodes.get(properties.nodes);
            var html = Browser.build_path(select_node[0]["id"]);
            document.getElementById('selection').innerHTML = html;
        }
    });
}
/*
 * CKharitonov
 */
Browser.add_nodes = function(parent){
    if (Browser.data == null) return;
    var nodes = [];
    var edges = [];
    for (var i=0; i<Browser.data.length; i++){
        if (Browser.data[i]["parent"] == parent){
            nodes.push({
                id: Browser.data[i]["id"],
                label: Browser.data[i]["code"],
                title: '<div style="max-width:200px;white-space:pre-wrap;">'+Browser.data[i]["name"]+'</div>',
                group: Browser.data[i]["parent"],
                is_open: false
            });
        }
    }
    Browser.nodes.add(nodes);
    for (var i=0; i<Browser.data.length; i++){
        if (Browser.data[i]["parent"] == parent){
            edges.push({
                from: Browser.data[i]["parent"],
                to: Browser.data[i]["id"]
            });
        }
    }
    Browser.edges.add(edges);
}
/*
 * CKharitonov
 */
Browser.remove_nodes_edges = function(parent){
    for (var i in Browser.edges["_data"]){
        if (Browser.edges["_data"][i]["from"] == parent){
            Browser.remove_nodes_edges(Browser.edges["_data"][i]["to"]);
            Browser.nodes.remove(Browser.edges["_data"][i]["to"]);
            Browser.edges.remove(Browser.edges["_data"][i]["id"]);
        }
    }
}
/*
 * CKharitonov
 */
Browser.focus_on_node = function(parent){
    var node_id = parent;
    var options = {
        scale: 1,
        animation: {
            duration: 5000,
            easingFunction: "easeInOutQuad"
        }
    }
    Browser.network.focusOnNode(node_id,options);
}
/*
 * CKharitonov
 */
Browser.get_path = function(id){
    var node = Browser.nodes.get(id);
    if (node != null){
        Browser.path.push(node);
        if (node["group"] == 0 || node["group"] == null){
            return;
        }
        else {
            Browser.get_path(node["group"]);
        }
    }
}
/*
 * CKharitonov
 */
Browser.build_path = function(id){
    Browser.path = [];
    Browser.get_path(id);
    var html = '<b>&nbsp;&nbsp;&nbsp;'+langs.get_term('txt_selected')+': ';
    if (Browser.path.length != 0){
        for(var i=Browser.path.length-1; i>=0; i--){
            if (i == 0){
                html += '<span style="cursor:pointer;" onclick="Browser.focus_on_node('+Browser.path[i]["id"]+')">'+Browser.path[i]["label"]+'</a></span>';
            }
            else {
                html += '<span style="cursor:pointer;" onclick="Browser.focus_on_node('+Browser.path[i]["id"]+')">'+Browser.path[i]["label"]+'</a></span> / ';
            }
        }
    }
    html += '</b>';
    return html;
}