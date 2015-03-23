angular.module('animateApp', [])
    .controller('AnimateCtrl', function($rootScope,$scope, $timeout) {

        function buildShape () {
            var maxVelocity = 100;
            return {
                color     : '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
                x         : Math.min(380,Math.max(20,(Math.random() * 380))),
                y         : Math.min(180,Math.max(20,(Math.random() * 180))),
                height    : Math.random()*200,
                width     : Math.random()*200,
                velX    : (Math.random() * maxVelocity),
                velY    : (Math.random() * maxVelocity)
            };
        }

        // Publish list of shapes on the $scope/presentationModel
        // Then populate the list with 100 shapes randomized in position
        // and color
        $scope.shapes = [];
        $scope.count=0;
        $scope.friction=1;
        $scope.is_blackhole=false;
        $scope.is_gravity=false;

        for (i = 0; i < 100; i++) {
            $scope.shapes.push( buildShape() );
        }

        // Start timer-based, changes of the shape properties
        // animator( $scope.shapes, $timeout );

    $scope.removeBob = function($index) {
        $scope.shapes.splice($index,1)
        if ($scope.shapes.length===0){
            alert("YOU WON!!")
        }
        addCounter();
        }

    function addCounter(){
        $scope.count++;
        };

    var animate = animator($scope,$scope.shapes,$timeout)
    });
    


function animator($scope,shapes, $timeout) {
    (function tick() {

        $scope.flipGravity = function(){
            $scope.is_gravity=!$scope.is_gravity;
        }
        $scope.flipBlackHole = function(){
            $scope.is_blackhole=!$scope.is_blackhole;
        }

        $scope.incFriction = function(){
            if($scope.friction<1){
                $scope.friction+=0.01;
            }
        }
        $scope.decFriction = function(){
            if($scope.friction>0){
                $scope.friction-=0.01;
            }
        }

        var i;
        var maxX      = 400;
        var maxY      = 400;
        var now = new Date().getTime();
        // console.log(shapes.length,is_gravity,is_blackhole,friction)

        for (i = 0; i < shapes.length; i++) {
            var shape = shapes[i];
            shape.velY*=$scope.friction;
            shape.velX*=$scope.friction;

            var elapsed = (shape.timestamp || now) - now;

            shape.timestamp = now;

            // position of blackhole

            var x2=200;
            var y2=200;

            // Check for blackhole
            if ($scope.is_blackhole){gravity_change(shape,x2,y2)};

            shape.x += elapsed * shape.velX / 1000;
            shape.y += elapsed * shape.velY / 1000;

            if (shape.x > maxX) {
                shape.x = maxX ;
                shape.velX *= -1;
            }
            if (shape.x < 30) {
                shape.x = 30;
                shape.velX *= -1;
            }
            if (shape.y > maxY) {
                shape.y = maxY ;
                shape.velY *= -1;
            }
            if (shape.y < 50) {
                shape.y = 50;
                shape.velY *= -1;
            }
            if (shape.y < maxY){
                shape.velY-=$scope.is_gravity;
            }
        }
        // call the tick function again after a delay
        $timeout(tick, 20);
    })();
}

function gravity_change(shape,x2,y2){
    var del_X=Math.abs(x2-shape.x);
    var del_Y=Math.abs(y2-shape.y);
    var gforce=500/Math.sqrt(Math.pow(del_X,2)+Math.pow(del_Y,2));
    var angle=Math.atan2(del_Y,del_X);

    var dvx=gforce*Math.cos(angle);
    var dvy=gforce*Math.sin(angle);
    if (shape.x>x2){shape.velX+=dvx}
    else {shape.velX-=dvx}
    if (shape.y>y2){shape.velY+=dvy}
    else {shape.velY-=dvy}
    return shape;
}