function fixInfinity(val) {
    return !isFinite(val) ? 0 : val;
}
