<?php
defined('BASEPATH') OR exit('No direct script access allowed');
?><!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/html">
<head>
    <meta charset="utf-8">
    <title>Welcome to CodeIgniter</title>

    <style type="text/css">

        /*::selection { background-color: #E13300; color: white; }*/
        /*::-moz-selection { background-color: #E13300; color: white; }*/

        body {
            background-color: #fff;
            margin: 40px;
            font: 13px/20px normal Helvetica, Arial, sans-serif;
            color: #4F5155;

        }
        input[type="text"]{
            margin: 10px;
            color:teal;
            font-family: "Lucida Sans Unicode", "Lucida Grande", Sans-Serif;
            font-size: 14px;
        }
        label{
            display: inline-block;
            width:100px;
            color:royalblue;
            font-family: "Lucida Sans Unicode", "Lucida Grande", Sans-Serif;
            font-size: 14px;
        }

    </style>
</head>
<body>
    <div class="content"
    <fieldset>
        <form action=" " method="post">
            <label for="number">Множитель</label>
            <input type="text" id = "number" name="number"><br>
            <label for="count">Размерность</label>
            <input type="text" id = "count" name="count"><br>
            <input type="submit" class="buton" value="Построить таблицу">
        </form>
    </fieldset>


    </div> 
<!---->
<!--    <footer>Page rendered in <strong>{elapsed_time}</strong> seconds. --><?php //echo  (ENVIRONMENT === 'development') ?
//            'CodeIgniter Version <strong>' . CI_VERSION . '</strong>' : '' ?><!--</footer>-->

</body>
</html>