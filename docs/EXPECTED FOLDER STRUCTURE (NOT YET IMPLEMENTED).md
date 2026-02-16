EXPECTED FOLDER STRUCTURE (NOT YET IMPLEMENTED)  
aegisai/  
│  
├── firewall/                     ← 🛡 Runtime Security Engine  
│   ├── app/  
│   │   ├── main.py  
│   │   │  
│   │   ├── core/  
│   │   │   ├── config.py  
│   │   │   ├── risk\_engine.py  
│   │   │   ├── policy\_engine.py  
│   │   │   └── logger.py  
│   │   │  
│   │   ├── middleware/  
│   │   │   └── request\_interceptor.py  
│   │   │  
│   │   ├── routes/  
│   │   │   ├── chat.py  
│   │   │   ├── sessions.py  
│   │   │   └── health.py  
│   │   │  
│   │   ├── services/  
│   │   │   ├── ml\_client.py  
│   │   │   ├── llm\_client.py  
│   │   │   └── session\_manager.py  
│   │   │  
│   │   ├── models/  
│   │   │   ├── request\_models.py  
│   │   │   └── response\_models.py  
│   │   │  
│   │   └── db/  
│   │       ├── database.py  
│   │       └── log\_schema.py  
│   │  
│   ├── config/  
│   │   └── tool\_policy.json  
│   │  
│   ├── tests/  
│   └── requirements.txt  
│  
│  
├── ml\_service/                   ← 🤖 ML Detection Engine  
│   ├── app/  
│   │   ├── main.py  
│   │   │  
│   │   ├── routes/  
│   │   │   ├── analyze\_prompt.py  
│   │   │   └── analyze\_session.py  
│   │   │  
│   │   ├── inference/  
│   │   │   ├── injection\_model.py  
│   │   │   ├── anomaly\_model.py  
│   │   │   └── embedding\_engine.py  
│   │   │  
│   │   ├── training/  
│   │   │   ├── train\_injection.py  
│   │   │   ├── train\_anomaly.py  
│   │   │   └── dataset\_loader.py  
│   │   │  
│   │   ├── preprocessing/  
│   │   │   └── feature\_extractor.py  
│   │   │  
│   │   └── utils/  
│   │       └── helpers.py  
│   │  
│   ├── saved\_models/  
│   ├── notebooks/  
│   └── requirements.txt  
│  
│  
├── dashboard/                    ← 🌐 Monitoring & Visualization UI  
│   ├── src/  
│   │   ├── pages/  
│   │   │   ├── index.tsx  
│   │   │   ├── sessions.tsx  
│   │   │   ├── injections.tsx  
│   │   │   └── settings.tsx  
│   │   │  
│   │   ├── components/  
│   │   │   ├── RiskGauge.tsx  
│   │   │   ├── Heatmap.tsx  
│   │   │   ├── SessionTable.tsx  
│   │   │   ├── InjectionTimeline.tsx  
│   │   │   └── ToolAlert.tsx  
│   │   │  
│   │   ├── services/  
│   │   │   └── api.ts  
│   │   │  
│   │   ├── hooks/  
│   │   │   └── useWebSocket.ts  
│   │   │  
│   │   └── utils/  
│   │       └── constants.ts  
│   │  
│   ├── package.json  
│   └── tailwind.config.js  
│  
│  
├── shared/                       ← 🔥 DO NOT IGNORE THIS FOLDER  
│   ├── api\_contract.md  
│   ├── schemas.py  
│   └── constants.py  
│  
│  
├── docs/  
│   ├── architecture.md  
│   ├── risk\_model.md  
│   └── db\_schema.md  
│  
│  
├── docker-compose.yml  
├── .env.example  
├── .gitignore  
└── README.md

