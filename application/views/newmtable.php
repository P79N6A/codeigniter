
<html>
<head>
    <title>Forma</title>
    <style>
        table {
            font-family: "Lucida Sans Unicode", "Lucida Grande", Sans-Serif;
            font-size: 14px;
            border-collapse: collapse;
            text-align: center;
            margin: 10px;
        }
        th, td:first-child {
            background: #AFCDE7;
            color: white;
            padding: 10px 20px;
        }
        th, td {
            border-style: solid;
            border-width: 0 1px 1px 0;
            border-color: white;
        }
        td {
            background: #D8E6F3;
        }
        th:first-child, td:first-child {
            text-align: left;
        }
        input[type = "text"] {
            margin: 10px;
            width: 200px;
            height: 20px;

        }

    </style>
</head>

<body>

<table>
    <tr>
        <th>Выражение</th>
        <th>Результат</th>
    </tr>
<?php
for($i = 0;$i < $count; $i++){
$res = $i * $number;
echo "<tr >
        <td>$number * $i </td>
        <td> $res</td>
      </tr>";

}?>
</table>
</body>
</html>




