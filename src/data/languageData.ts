const languageData = {
  "eng": "English",
  "ger": "German",
  "fre": "French",
  "spa": "Spanish",
  "rus": "Russian",
  "chi": "Chinese",
  "jpn": "Japanese",
  "ita": "Italian",
  "por": "Portuguese",
  "lat": "Latin",
  "ara": "Arabic",
  "und": "Undetermined",
  "dut": "Dutch",
  "pol": "Polish",
  "unknown": "unknown",
  "swe": "Swedish",
  "heb": "Hebrew",
  "dan": "Danish",
  "kor": "Korean",
  "cze": "Czech",
  "hin": "Hindi",
  "ind": "Indonesian",
  "hun": "Hungarian",
  "unk": "unk",
  "mul": "Multiple languages",
  "nor": "Norwegian",
  "tur": "Turkish",
  "scr": "Croatian",
  "zxx": "No linguistic content",
  "urd": "Urdu",
  "tha": "Thai",
  "gre": "Greek, Modern (1453-)",
  "per": "Persian",
  "grc": "Greek, Ancient (to 1453)",
  "san": "Sanskrit",
  "tam": "Tamil",
  "ukr": "Ukrainian",
  "bul": "Bulgarian",
  "scc": "Serbian",
  "rum": "Romanian",
  "ben": "Bengali",
  "vie": "Vietnamese",
  "fin": "Finnish",
  "arm": "Armenian",
  "cat": "Catalan",
  "slo": "Slovak",
  "slv": "Slovenian",
  "yid": "Yiddish",
  "mar": "Marathi",
  "may": "Malay",
  "pan": "Panjabi",
  "afr": "Afrikaans",
  "tel": "Telugu",
  "ota": "Turkish, Ottoman",
  "tib": "Tibetan",
  "ice": "Icelandic",
  "mal": "Malayalam",
  "est": "Estonian",
  "bel": "Belarusian",
  "lit": "Lithuanian",
  "mac": "Macedonian",
  "lav": "Latvian",
  "nep": "Nepali",
  "uzb": "Uzbek",
  "wel": "Welsh",
  "kan": "Kannada",
  "geo": "Georgian",
  "guj": "Gujarati",
  "snh": "Sinhalese",
  "srp": "Serbian",
  "hrv": "Croatian (Discontinued Code)",
  "bur": "Burmese",
  "pli": "Pali",
  "kaz": "Kazakh",
  "tgl": "Tagalog",
  "aze": "Azerbaijani",
  "mon": "Mongolian",
  "jav": "Javanese",
  "ser": "ser",
  "iri": "Irish (Discontinued Code)",
  "hau": "Hausa",
  "fro": "French, Old (ca. 842-1300)",
  "swa": "Swahili",
  "map": "Austronesian (Other)",
  "gmh": "German, Middle High (ca. 1050-1500)",
  "syr": "Syriac, Modern",
  "raj": "Rajasthani",
  "ori": "Oriya",
  "alb": "Albanian",
  "cro": "cro",
  "jap": "jap",
  "sla": "Slavic (Other)",
  "enm": "English, Middle (1100-1500)",
  "arc": "Aramaic",
  "pra": "Prakrit languages",
  "sin": "Sinhalese",
  "chu": "Church Slavic",
  "ang": "English, Old (ca. 450-1100)",
  "gle": "Irish",
  "nic": "Niger-Kordofanian (Other)",
  "kir": "Kyrgyz",
  "frm": "French, Middle (ca. 1300-1600)",
  "tut": "Altaic (Other)",
  "roa": "Romance (Other)",
  "tag": "Tagalog (Discontinued Code)",
  "inc": "Indic (Other)",
  "tat": "Tatar",
  "myn": "Mayan languages",
  "tuk": "Turkmen",
  "sun": "Sundanese",
  "baq": "Basque",
  "sai": "South American Indian (Other)",
  "mai": "Maithili",
  "egy": "Egyptian",
  "akk": "Akkadian",
  "sit": "Sino-Tibetan (Other)",
  "que": "Quechua",
  "pro": "Provençal (to 1500)",
  "cop": "Coptic",
  "int": "Interlingua (International Auxiliary Language Association) (Discontinued Code)",
  "yor": "Yoruba",
  "paa": "Papuan (Other)",
  "bra": "Braj",
  "new": "Newari",
  "pus": "Pushto",
  "amh": "Amharic",
  "bos": "Bosnian",
  "rom": "Romani",
  "gem": "Germanic (Other)",
  "fiu": "Finno-Ugrian (Other)",
  "mol": "Moldavian (Discontinued Code)",
  "fle": "fle",
  "roh": "Raeto-Romance",
  "fri": "Frisian (Discontinued Code)",
  "lao": "Lao",
  "snd": "Sindhi",
  "wen": "Sorbian (Other)",
  "nah": "Nahuatl",
  "bak": "Bashkir",
  "pal": "Pahlavi",
  "asm": "Assamese",
  "glg": "Galician",
  "cai": "Central American Indian (Other)",
  "gag": "Galician (Discontinued Code)",
  "uig": "Uighur",
  "tgk": "Tajik",
  "gae": "Scottish Gaelix (Discontinued Code)",
  "khm": "Khmer",
  "esp": "Esperanto (Discontinued Code)",
  "epo": "Esperanto",
  "gez": "Ethiopic",
  "bho": "Bhojpuri",
  "gla": "Scottish Gaelic",
  "kas": "Kashmiri",
  "som": "Somali",
  "nai": "North American Indian (Other)",
  "fry": "Frisian",
  "crp": "Creoles and Pidgins (Other)",
  "zul": "Zulu",
  "taj": "Tajik (Discontinued Code)",
  "mao": "Maori",
  "eth": "Ethiopic (Discontinued Code)",
  "tah": "Tahitian",
  "mis": "Miscellaneous languages",
  "lan": "Occitan (post 1500) (Discontinued Code)",
  "haw": "Hawaiian",
  "sna": "Shona",
  "cpf": "Creoles and Pidgins, French-based (Other)",
  "cau": "Caucasian (Other)",
  "jrb": "Judeo-Arabic",
  "kur": "Kurdish",
  "sot": "Sotho",
  "awa": "Awadhi",
  "bre": "Breton",
  "oci": "Occitan (post-1500)",
  "ban": "Balinese",
  "ibo": "Igbo",
  "lad": "Ladino",
  "mlg": "Malagasy",
  "goh": "German, Old High (ca. 750-1050)",
  "rur": "rur",
  "tsn": "Tswana",
  "sux": "Sumerian",
  "enf": "enf",
  "ber": "Berber (Other)",
  "doi": "Dogri",
  "gua": "Guarani (Discontinued Code)",
  "bnt": "Bantu (Other)",
  "esk": "Eskimo languages (Discontinued Code)",
  "kin": "Kinyarwanda",
  "mni": "Manipuri",
  "xho": "Xhosa",
  "ssa": "Nilo-Saharan (Other)",
  "aym": "Aymara",
  "ful": "Fula",
  "dum": "Dutch, Middle (ca. 1050-1350)",
  "tar": "Tatar (Discontinued Code)",
  "end": "end"
};

export default languageData;
