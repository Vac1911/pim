window.ms = require('./lib/milgraphics');
import "./components/LayerDisplay";

import "./map.js";
import MilUnit from "./MilUnit";
import './styles.scss'

if(document.getElementById('sidebar'))
    document.getElementById('sidebar').innerHTML = (new MilUnit()).getSym();