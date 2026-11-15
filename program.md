# Loop contract for zoom-game
Fill this in only when the project gets a loop (after the diary shows the work repeats).

Metric: <one number or pass/fail, and the exact command that prints it>
Evaluator: ./verify.sh and checks/ (read-only to agents)
May edit: <the files the loop may change>
Each run: make one change, run the evaluator.
  Better: keep, log "keep".  Not better: revert, log "discard".  Crash: revert, log "crash".
Ties: the simpler version wins.
Log: results.tsv, one line per run.
Stop: <condition>, or when Nick says stop.
