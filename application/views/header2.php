<?php
echo "<link rel='stylesheet' type='text/css' href='".base_url()."js/qgeovision/mocha/mocha.css'>";
echo "<div id='mocha'></div>";
echo "<script src='".base_url()."js/qgeovision/leaflet.markercluster/spec/expect.js'></script>";
echo "<script type='text/javascript' src='".base_url()."js/qgeovision/mocha/mocha.js'></script>";
//echo "<script type='text/javascript' src='.js'></script>";
echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/sinon.js'></script>";
//echo "<script type='text/javascript' src='../node_modules/leaflet/dist/leaflet-src.js'></script>";

//<!-- source files -->
echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/src/DistanceGrid.js'></script>";
echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/src/MarkerCluster.js'></script>";
echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/src/MarkerClusterGroup.js'></script>";
echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/src/MarkerCluster.QuickHull.js'></script>";
echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/src/MarkerCluster.Spiderfier.js'></script>";
echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/src/MarkerOpacity.js'></script>";
echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/src/MarkerClusterGroup.Refresh.js'></script>";

//echo"<script>
//    mocha.setup('bdd');
//    mocha.ignoreLeaks();
//</script>";



//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/SpecHelper.js'></script>";
//
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/LeafletSpec.js'></script>";
//
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/DistanceGridSpec.js'></script>";
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/QuickHullSpec.js'></script>";
//
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/AddLayer.MultipleSpec.js'></script>";
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/AddLayer.SingleSpec.js'></script>";
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/AddLayersSpec.js'></script>";
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/animateOptionSpec.js'></script>";
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/singleMarkerModeSpec.js'></script>";
//
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/ChildChangingIconSupportSpec.js'></script>";
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/markerMoveSupportSpec.js'></script>";

//<!--echo "</script>";-->
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/CircleSupportSpec.js'></script>";
//
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/onAddSpec.js'></script>";
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/onRemoveSpec.js'></script>";
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/clearLayersSpec.js'></script>";
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/eachLayerSpec.js'></script>";
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/eventsSpec.js'></script>";
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/getBoundsSpec.js'></script>";
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/getLayersSpec.js'></script>";
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/getVisibleParentSpec.js'></script>";
//
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/NonPointSpec.js'></script>";
//
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/RemoveLayerSpec.js'></script>";
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/removeLayersSpec.js'></script>";
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/spiderfySpec.js'></script>";
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/unspiderfySpec.js'></script>";
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/zoomAnimationSpec.js'></script>";
//
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/RememberOpacity.js'></script>";
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/supportNegativeZoomSpec.js'></script>";
//
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/RefreshSpec.js'></script>";
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/removeOutsideVisibleBoundsSpec.js'></script>";
//echo "<script type='text/javascript' src='".base_url()."js/qgeovision/leaflet.markercluster/spec/suites/nonIntegerZoomSpec.js'></script>";

//echo'<script> (window.mochaPhantomJS || window.mocha).run();
//</script>'
?>