window.importAI = function (intelligence) {
    let Runner = window.Runner;
    let r = Runner.instance_;

    let getInputs = function (r) {
        let defaultObstacle = {xPos: 650, width: 30, typeConfig: {height: 40}, yPos: 100};
        let o = r.horizon.obstacles.length ? r.horizon.obstacles[0] : defaultObstacle;
        if (o.xPos - 50 <= 0) {
            o = r.horizon.obstacles.length > 1 ? r.horizon.obstacles[1] : defaultObstacle
        }
        return {
            speed: r.currentSpeed,
            distance: o.xPos - 50,
            width: o.width,
            height: o.typeConfig.height,
            altitude: (150 - 10 - o.yPos - o.typeConfig.height) > 40 ? 1 : 0
        }
    };
    let getOutput = function (network, inputs) {
        let output = {};
        for (let i = 1; i < network.length; i++) {
            let layer = network[i];
            output = {};
            for (let nodeName in layer) {
                let node = layer[nodeName];
                let sum = node.bias;
                for (let edgeName in node.weights) {
                    sum += node.weights[edgeName] * inputs[edgeName]
                }
                output[nodeName] = (1 / (1 + Math.exp(-sum)))
            }
            inputs = output
        }
        return output
    };
    let shouldJump = function (network, inputs) {
        let output = getOutput(network, inputs);
        return output.jump > 0.5
    };
    let generateIntelligence = function (values) {
        let generateNode = function generateNode(index, isFirstLayer) {
            let offset = index * 6;
            let keys = isFirstLayer ? ['speed', 'distance', 'width', 'height', 'altitude'] : [0, 1, 2, 3, 4];
            return {
                bias: values[offset],
                weights: {
                    [keys[0]]: values[offset + 1],
                    [keys[1]]: values[offset + 2],
                    [keys[2]]: values[offset + 3],
                    [keys[3]]: values[offset + 4],
                    [keys[4]]: values[offset + 5]
                }
            }
        };
        return [
            {speed: {}, distance: {}, width: {}, height: {}, altitude: {}},
            {
                0: generateNode(0, true),
                1: generateNode(1, true),
                2: generateNode(2, true),
                3: generateNode(3, true),
                4: generateNode(4, true)
            },
            {jump: generateNode(5)}
        ]
    };

    let init = null;
    let neuralNetwork = generateIntelligence(intelligence);

    setInterval(function () {
        if (r && init === null) {
            r.startGame();
            r.playIntro();
            init = false
        } else if (init === false && r.playingIntro === false) {
            r.tRex.startJump(r.currentSpeed);
            init = true
        } else if (init && !r.playing) {
            r.restart()
        } else if (init) {
            if (!r.tRex.jumping) {
                let inputs = getInputs(r);
                if (shouldJump(neuralNetwork, inputs)) {
                    r.tRex.startJump(r.currentSpeed)
                }
            }
        }
    }, 50)
};


r = Runner.instance_;
setInterval(function () {
    try {
        if (r.playing) {
            ox = r.horizon.obstacles[0].xPos;
            oy = r.horizon.obstacles[0].yPos;
            ol = r.horizon.obstacles.length;
            dnx = r.tRex.xPos;
            dny = r.tRex.yPos;

            console.log('dino x:', dnx, 'dino y:', dny, 'obstacles l:', ol, 'o0x:', ox, 'o0y:', oy);
        }
    } catch (e) {

    }
}, 50);