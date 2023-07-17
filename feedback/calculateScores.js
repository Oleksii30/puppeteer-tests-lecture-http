const calculateScores = (testResult, scores, maxScore) => {
    const passedTestsScore = testResult.passes.map(test => scores[test.title]).reduce((x, y) => x + y, 0);
    const testsScore = Object.values(scores).reduce((x,y) => x + y);

    const mark = ((passedTestsScore * maxScore) / testsScore).toFixed(1);

    return Number(mark);
};

module.exports = calculateScores;
