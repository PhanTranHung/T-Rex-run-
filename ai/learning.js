document.addEventListener('DOMContentLoaded', function () {
    // return // return if bot mode

    let Runner = window.Runner;
    let r = Runner.instance_;
    let common = window.common;

    let solutions = [];
    let wasPlaying = false;

    function addSolution(output) {
        let inputs = common.getInputs(r);
        if (!solutions.length || inputs.distance < 600) {
            console.info('new-solution', output, JSON.stringify(inputs));
            solutions.push({i: inputs, o: output})
        }
    }

    setInterval(function () {
        if (r.playing) {
            if (!r.tRex.jumping) {
                addSolution(0)
            }
        } else if (wasPlaying && solutions.length) {
            solutions.splice(-1, 1) // remove last solution 'cause it was wrong: we lost the game
        }
        wasPlaying = r.playing
    }, 100);

    document.addEventListener('keydown', function (e) {
        if (Runner.keycodes.JUMP[e.keyCode] && wasPlaying && r.playing) {
            if (solutions.length) {
                solutions.splice(-1, 1) // remove last solution (a no-jump one)
            }
            addSolution(1)
        }
    });

    function getSolutions() {
        return solutions
    }

    // Put the JSON.stringify of getSolutions into data.js
    window.getSolutions = getSolutions

});
