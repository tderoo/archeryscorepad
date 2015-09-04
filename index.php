<!DOCTYPE html>
<html>
<head>
    <title>Archery scrorepad</title>

    <link rel="stylesheet" href="css/default.css">

    <script src="js/jquery-2.1.4.min.js"></script>
    <script src="js/angular.min.js"></script>
</head>
<body ng-app="" ng-init="leeftijden={ 1: 'Aspirant', 2: 'Junior', 3: 'Senior' };
                         boogtypen={ 1: 'Recurve', 2: 'Compound', 3: 'Barebow', 4: 'Traditioneel/hout' }">
    <h1>Archery scorepad</h1>
    <hr>

        <table>
            <tr>
                <td>
                    <label for="name">Naam:</label>
                </td>
                <td>
                    <input type="text" id="name" class="name" name="name">
                </td>
            </tr>
            <tr>
                <td><label for="datum">Datum:</label></td>
                <td><input type="date" name="date" id="datum"></td>
            </tr>
            <tr>
                <td>
                    <label for="leeftijdsklasse">Leeftijdsklasse:</label>
                </td>
                <td>
                    <select id="leeftijdsklasse" name="age">
                        <option ng-repeat="leeftijd in leeftijden">
                            {{ leeftijd }}
                        </option>
                    </select>
                </td>
            </tr>
            <tr>
                <td><label for="boogtype">Boogtype:</label></td>
                <td>
                    <select id="boogtype" name="bowtype">
                        <option ng-repeat="boogtype in boogtypen">
                            {{ boogtype }}
                        </option>
                    </select>
                </td>
            </tr>
        </table>
        <hr>
        <table id="scorepad">
            <thead>
            <tr>
                <td></td>
                <td class="col1">1</td>
                <td class="col2">2</td>
                <td class="col3">3</td>
                <td class="col4">Serie</td>
                <td class="col5">Sub-totaal</td>
            </tr>
            </thead>
            <tbody>
            <tr class="a">
                <td>3</td>
                <td class="a1"><input type="text" class="a1" ng-model="a1"></td>
                <td class="a2"><input type="text" class="a2" ng-model="a2"></td>
                <td class="a3"><input type="text" class="a3" ng-model="a3"></td>
                <td class="a4 ser1 ser"><input type="text" class="a4" ng-model="ser1" value="{{ a1 }}"></td>
                <td class="a5 sub1 sub"><input type="text" class="a5" ng-model="sub1" value="{{ ser1 }}"></td>
            </tr>
            <tr class="b">
                <td>6</td>
                <td class="b1"><input type="text" class="b1"></td>
                <td class="b2"><input type="text" class="b2"></td>
                <td class="b3"><input type="text" class="b3"></td>
                <td class="b4 ser2 ser"><input type="text" class="b4"></td>
                <td class="b5 sub2 sub"><input type="text" class="b5"></td>
            </tr>
            <tr class="c">
                <td>9</td>
                <td class="c1"><input type="text" class="c1"></td>
                <td class="c2"><input type="text" class="c2"></td>
                <td class="c3"><input type="text" class="c3"></td>
                <td class="c4 ser3 ser"><input type="text" class="c4"></td>
                <td class="c5 sub3 sub"><input type="text" class="c5"></td>
            </tr>
            <tr class="d">
                <td>12</td>
                <td class="d1"><input type="text" class="d1"></td>
                <td class="d2"><input type="text" class="d2"></td>
                <td class="d3"><input type="text" class="d3"></td>
                <td class="d4 ser4 ser"><input type="text" class="d4"></td>
                <td class="d5 sub4 sub"><input type="text" class="d5"></td>
            </tr>
            <tr class="e">
                <td>15</td>
                <td class="e1"><input type="text" class="e1"></td>
                <td class="e2"><input type="text" class="e2"></td>
                <td class="e3"><input type="text" class="e3"></td>
                <td class="e4 ser5 ser"><input type="text" class="e4"></td>
                <td class="e5 sub5 sub"><input type="text" class="e5"></td>
            </tr>
            <tr class="f">
                <td>18</td>
                <td class="f1"><input type="text" class="f1"></td>
                <td class="f2"><input type="text" class="f2"></td>
                <td class="f3"><input type="text" class="f3"></td>
                <td class="f4 ser6 ser"><input type="text" class="f4"></td>
                <td class="f5 sub6 sub"><input type="text" class="f5"></td>
            </tr>
            <tr class="g">
                <td>21</td>
                <td class="g1"><input type="text" class="g1"></td>
                <td class="g2"><input type="text" class="g2"></td>
                <td class="g3"><input type="text" class="g3"></td>
                <td class="g4 ser7 ser"><input type="text" class="g4"></td>
                <td class="g5 sub7 sub"><input type="text" class="g5"></td>
            </tr>
            <tr class="h">
                <td>24</td>
                <td class="h1"><input type="text" class="h1"></td>
                <td class="h2"><input type="text" class="h2"></td>
                <td class="h3"><input type="text" class="h3"></td>
                <td class="h4 ser8 ser"><input type="text" class="h4"></td>
                <td class="h5 sub8 sub"><input type="text" class="h5"></td>
            </tr>
            <tr class="i">
                <td>27</td>
                <td class="i1"><input type="text" class="i1"></td>
                <td class="i2"><input type="text" class="i2"></td>
                <td class="i3"><input type="text" class="i3"></td>
                <td class="i4 ser9 ser"><input type="text" class="i4"></td>
                <td class="i5 sub9 sub"><input type="text" class="i5"></td>
            </tr>
            <tr class="j">
                <td>30</td>
                <td class="j1"><input type="text" class="j1"></td>
                <td class="j2"><input type="text" class="j2"></td>
                <td class="j3"><input type="text" class="j3"></td>
                <td class="j4 ser10 ser"><input type="text" class="j4"></td>
                <td class="j5 sub10 sub"><input type="text" class="j5"></td>
            </tr>
            <tr class="totals">
                <td colspan="4"><label for="total">Totaal:</label></td>
                <td class="total" colspan="2"><input id="total" type="text" class="total" name="total"></td>
            </tr>
            </tbody>
        </table>
        <button onclick="getData()">Invoeren</button>


    <script src="js/default.js"></script>
</body>
</html>