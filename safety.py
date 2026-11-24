import re

# Conservative label heuristic; form submit controls are checked separately in agent.py.
DANGEROUS_NAME = re.compile(r"\b(submit|send|purchase|buy|book|pay|checkout|confirm|delete|remove|cancel|apply|place order|transfer)\b", re.I)
