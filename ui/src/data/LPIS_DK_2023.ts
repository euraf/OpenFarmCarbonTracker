

type YES_NO_NAN = "JA" | "NEJ" | "-";

// COLUMNS:
// Afgrødekode
// Navn
// Kulstoflagrende afgrøde
// Bælgafgrøde
// Tæller med i omdriften

export const LPIS_DK: [number, string, YES_NO_NAN, YES_NO_NAN, YES_NO_NAN][] = [
  [1,"Vårbyg","-","-","JA"],
  [2,"Vårhvede","-","-","JA"],
  [3,"Vårhavre","-","-","JA"],
  [4,"Blanding af vårsåede arter","-","-","JA"],
  [5,"Majs til modenhed","-","-","JA"],
  [6,"Vårhvede, brødhvede","-","-","JA"],
  [7,"Korn + bælgsæd under 50 pct. bælgsæd","-","-","JA"],
  [8,"Vårspelt","-","-","JA"],
  [9,"Vinterspelt","-","-","JA"],
  [10,"Vinterbyg","-","-","JA"],
  [11,"Vinterhvede","-","-","JA"],
  [13,"Vinterhvede, brødhvede","-","-","JA"],
  [14,"Vinterrug","-","-","JA"],
  [15,"Vinterhybridrug","-","-","JA"],
  [16,"Vintertriticale","-","-","JA"],
  [17,"Blanding af efterårssåede arter","-","-","JA"],
  [18,"Korn og bælgsæd (over 50 pct. bælgsæd)","-","JA","JA"],
  [19,"Majs til modenhed med græsudlæg","JA","-","JA"],
  [21,"Vårraps","-","-","JA"],
  [22,"Vinterraps","-","-","JA"],
  [23,"Rybs","-","-","JA"],
  [24,"Solsikke","-","-","JA"],
  [25,"Sojabønner","-","JA","JA"],
  [26,"Linser","-","JA","JA"],
  [27,"Kikærter","-","JA","JA"],
  [30,"Ærter","-","JA","JA"],
  [31,"Hestebønner","-","JA","JA"],
  [32,"Lupin","-","JA","JA"],
  [35,"Bælgsæd, flerårig blanding","-","JA","JA"],
  [36,"Bælgsæd, andre typer til modenhed blanding","-","JA","JA"],
  [40,"Oliehør","-","-","JA"],
  [41,"Spindhør","-","-","JA"],
  [42,"Hamp","-","-","JA"],
  [51,"Blanding bredbladet afgrøde, frø/kerne","-","-","JA"],
  [52,"Quinoa","-","-","JA"],
  [53,"Boghvede","-","-","JA"],
  [54,"Bælgsæd blanding","-","JA","JA"],
  [55,"Vårrug","-","-","JA"],
  [56,"Vårtriticale","-","-","JA"],
  [57,"Vinterhavre","-","-","JA"],
  [58,"Sorghum","-","-","JA"],
  [101,"Rajgræsfrø, alm.","JA","-","JA"],
  [102,"Rajgræsfrø, alm. 1. år, efterårsudlagt","JA","-","JA"],
  [103,"Rajgræsfrø, ital.","JA","-","JA"],
  [104,"Rajgræsfrø, ital. 1. år efterårsudlagt","JA","-","JA"],
  [105,"Timothefrø","JA","-","JA"],
  [106,"Hundegræsfrø","JA","-","JA"],
  [107,"Engsvingelfrø","JA","-","JA"],
  [108,"Rødsvingelfrø","JA","-","JA"],
  [109,"Rajsvingelfrø","JA","-","JA"],
  [110,"Svingelfrø, bakke- (tidl. Stivbladet)","JA","-","JA"],
  [111,"Svingelfrø, strand-","JA","-","JA"],
  [112,"Engrapgræsfrø (marktype)","JA","-","JA"],
  [113,"Engrapsgræsfrø (plænetype)","JA","-","JA"],
  [114,"Rapgræsfrø, alm.","JA","-","JA"],
  [115,"Hvenefrø, alm. og krybende","JA","-","JA"],
  [116,"Rajgræs, hybrid","JA","-","JA"],
  [117,"Rajgræs, efterårsudlæg hybrid","JA","-","JA"],
  [118,"Rajsvingelfrø, efterårsudlagt","JA","-","JA"],
  [120,"Kløverfrø","JA","JA","JA"],
  [121,"Bælgplanter, frø","JA","JA","JA"],
  [122,"Kommenfrø","-","-","JA"],
  [123,"Valmuefrø","-","-","JA"],
  [124,"Spinatfrø","-","-","JA"],
  [125,"Bederoefrø","-","-","JA"],
  [126,"Blanding af markfrø til udsæd","-","-","JA"],
  [149,"Kartofler, lægge- (certificerede)","-","-","JA"],
  [150,"Kartofler, lægge- (egen opformering)","-","-","JA"],
  [151,"Kartofler, stivelses-","-","-","JA"],
  [152,"Kartofler, spise- (pakkeri, vejsalg)","-","-","JA"],
  [154,"Kartofler, spise- (proces, skrællet kogte)","-","-","JA"],
  [155,"Kartofler, pulver/granules","-","-","JA"],
  [156,"Kartofler, friteret/chips/pommes frites","-","-","JA"],
  [157,"Kartofler, spise-, tidligt høstede med efterafgrøder","-","-","JA"],
  [160,"Sukkerroer til fabrik","-","-","JA"],
  [161,"Cikorierødder","-","-","JA"],
  [162,"Blanding, andre industriafgrøder","-","-","JA"],
  [170,"Græs til fabrik (omdrift)","JA","-","JA"],
  [171,"Lucerne, slæt","JA","JA","JA"],
  [172,"Lucernegræs, over 25 pct. græs til slæt inkl. eget foder","JA","JA","JA"],
  [173,"Kløver til slæt","JA","JA","JA"],
  [174,"Kløvergræs til fabrik","JA","JA","JA"],
  [180,"Gul sennep","-","-","JA"],
  [182,"Blanding af oliearter","-","-","JA"],
  [210,"Vårbyg, helsæd","-","-","JA"],
  [211,"Vårhvede, helsæd","-","-","JA"],
  [212,"Vårhavre, helsæd","-","-","JA"],
  [213,"Blandkorn, vårsået, helsæd","-","-","JA"],
  [214,"Korn og bælgsæd, helsæd, under 50pct. bælgsæd","-","-","JA"],
  [215,"Ærtehelsæd","-","JA","JA"],
  [216,"Silomajs","-","-","JA"],
  [217,"Korn og bælgsæd, helsæd, over 50 pct. bælgsæd","-","JA","JA"],
  [218,"Silomajs med græsudlæg","JA","-","JA"],
  [220,"Vinterbyg, helsæd","-","-","JA"],
  [221,"Vinterhvede, helsæd","-","-","JA"],
  [222,"Vinterrug, helsæd","-","-","JA"],
  [223,"Vintertriticale, helsæd","-","-","JA"],
  [224,"Blandkorn, efterårssået helsæd","-","-","JA"],
  [230,"Blanding af vårkorn, grønkorn","-","-","JA"],
  [234,"Korn og bælgsæd, grønkorn, under 50 pct. bælgsæd","-","-","JA"],
  [235,"Blanding af vinterkorn, grønkorn","-","-","JA"],
  [236,"Græs med kløver/lucerne, under 50 pct. bælgsæd, omdrift","JA","JA","JA"],
  [237,"Græs med kløver/lucerne, over 50 pct. bælgsæd, omdrift","JA","JA","JA"],
  [247,"Miljøgræs MVJ-tilsagn (0 N), omdrift 1651","JA","-","JA"],
  [250,"Permanent græs, meget lavt udbytte","JA","-","NEJ"],
  [251,"Permanent græs, lavt udbytte","JA","-","NEJ"],
  [252,"Permanent græs, normalt udbytte","JA","-","NEJ"],
  [254,"Miljøgræs MVJ-tilsagn (0 N), permanent","JA","-","NEJ"],
  [255,"Permanent græs, under 50 pct. kløver/lucerne","JA","-","NEJ"],
  [256,"Permanent kløvergræs, over 50 pct. kløver/lucerne","JA","-","NEJ"],
  [257,"Permanent græs, uden kløver","JA","-","NEJ"],
  [259,"Permanent græs, fabrik, over 6 tons","JA","-","NEJ"],
  [260,"Græs med kløver/lucerne, under 50 pct. bælgplanter (omdrift)","JA","JA","JA"],
  [261,"Kløvergræs, over 50 pct. kløver (omdrift)","JA","JA","JA"],
  [262,"Lucernegræs, over 50 pct. lucerne (omdrift)","JA","JA","JA"],
  [263,"Græs uden kløvergræs (omdrift)","JA","-","JA"],
  [264,"Græs og kløvergræs uden norm, under 50 pct. kløver (omdrift)","JA","JA","JA"],
  [266,"Græs under 50 pct. kløver/lucerne, ekstremt lavt udbytte (omdrift)","JA","JA","JA"],
  [267,"Græs under 50 pct. kløver/lucerne, meget lavt udbytte (omdrift)","JA","JA","JA"],
  [268,"Græs under 50pct. kløver/lucerne, lavt udbytte (omdrift)","JA","JA","JA"],
  [269,"Græs, rullegræs","-","-","JA"],
  [270,"Græs til udegrise, omdrift","JA","JA","JA"],
  [271,"Rekreative formål","-","-","NEJ"],
  [272,"Permanent græs til fabrik","JA","-","NEJ"],
  [273,"Lucerne til fabrik","JA","JA","JA"],
  [274,"Permanent lucernegræs over 25 pct. græs, til fabrik","JA","-","NEJ"],
  [276,"Permanent græs og kløvergræs uden norm, under 50 pct. kløver","JA","-","NEJ"],
  [277,"Kløver til fabrik","JA","JA","JA"],
  [278,"Permanent lucerne og lucernegræs, over 50 pct. lucerne","JA","-","NEJ"],
  [279,"Permanent kløvergræs til fabrik","JA","-","NEJ"],
  [280,"Fodersukkerroer","-","-","JA"],
  [281,"Kålroer","-","-","JA"],
  [282,"Fodermarvkål","-","-","JA"],
  [283,"Fodergulerødder","-","-","JA"],
  [284,"Græs med vikke og andre bælgplanter, under 50 pct. bælgplanter","JA","JA","JA"],
  [285,"Græs og kløvergræs uden norm, over 50 pct. kløver (omdrift)","JA","JA","JA"],
  [286,"Permanent græs og kløvergræs uden norm, over 50 pct. kløver","JA","-","NEJ"],
  [287,"Græs til udegrise, permanent","JA","-","NEJ"],
  [305,"Permanent græs, uden udbetaling af økologitilskud","JA","-","NEJ"],
  [306,"Græs i omdrift, uden udbetaling af økologitilskud","JA","-","JA"],
  [310,"Brak, sommerslåning","JA","-","JA"],
  [311,"Skovrejsning på tidl. landbrugsjord 1","JA","-","NEJ"],
  [312,"20-årig udtagning","JA","-","JA"],
  [314,"20-årig udtagning med tilsagn om skovrejsning","JA","-","NEJ"],
  [316,"20-årig udtagning med fastholdelse, ej landbrugsareal","JA","-","NEJ"],
  [317,"Vådområder med udtagning","JA","-","JA"],
  [318,"MVJ, ej udtagning, ej landbrugsareal","JA","-","NEJ"],
  [319,"MVJ-tilsagn, udtagning, ej landbrugsareal","JA","-","JA"],
  [321,"Miljøtiltag, ej landbrugsarealer","JA","-","NEJ"],
  [322,"Minivådområder, projekttilsagn","-","-","NEJ"],
  [324,"Blomsterbrak","JA","-","JA"],
  [326,"Ej landbrug, MSO, omlagt fra permanent græs","JA","-","NEJ"],
  [327,"Markbræmme, på omdrift, sommerslåning","-","-","JA"],
  [328,"Markbræmme, på omdrift, med blomsterblanding","JA","-","JA"],
  [334,"Mark, på omdrift, forårsslåning","JA","-","JA"],
  [338,"Brak, forårsslåning","JA","-","JA"],
  [342,"Bestøverbrak","JA","-","JA"],
  [344,"Brak langs vandløb og søer, forårsslåning (alternativ til efterafgrøder)","JA","-","JA"],
  [345,"Brak langs vandløb og søer, sommerslåning (alternativ til efterafgrøder)","JA","-","JA"],
  [361,"Ikke støtteberettiget landbrugsareal","-","-","NEJ"],
  [362,"Paludikultur, omdriftsgræs","JA","-","JA"],
  [363,"Paludikultur, permanent græs","JA","-","NEJ"],
  [400,"Asieagurker","-","-","JA"],
  [401,"Asparges","-","-","NEJ"],
  [402,"Bladselleri","-","-","JA"],
  [403,"Blomkål","-","-","JA"],
  [404,"Broccoli","-","-","JA"],
  [405,"Courgette, squash","-","-","JA"],
  [406,"Grønkål","-","-","JA"],
  [407,"Gulerod","-","-","JA"],
  [408,"Hvidkål","-","-","JA"],
  [409,"Kinakål","-","-","JA"],
  [410,"Knoldselleri","-","-","JA"],
  [411,"Løg","-","-","JA"],
  [412,"Pastinak","-","-","JA"],
  [413,"Rodpersille","-","-","JA"],
  [415,"Porre","-","-","JA"],
  [416,"Rosenkål","-","-","JA"],
  [417,"Rødbede","-","-","JA"],
  [418,"Rødkål","-","-","JA"],
  [420,"Salat (friland)","-","-","JA"],
  [421,"Savojkål, spidskål","-","-","JA"],
  [422,"Spinat","-","-","JA"],
  [423,"Sukkermajs","-","-","JA"],
  [424,"Ærter, konsum","-","JA","JA"],
  [425,"Sukkermajs med græsudlæg","JA","-","JA"],
  [426,"Bønner, andre","-","JA","JA"],
  [429,"Jordskokker, konsum","-","-","JA"],
  [430,"Bladpersille","-","-","JA"],
  [431,"Purløg","-","-","JA"],
  [432,"Krydderurter (undtagen persille og purløg)","-","-","JA"],
  [434,"Grøntsager, andre (friland)","-","-","JA"],
  [440,"Solhat","-","-","JA"],
  [448,"Medicinplanter, et- og toårige","-","-","JA"],
  [449,"Medicinplanter, stauder","-","-","JA"],
  [450,"Grøntsager, blandinger","-","-","JA"],
  [482,"Skovlandbrug med permanent græs","JA","-","NEJ"],
  [483,"Skovlandbrug med græs i omdrift","JA","-","JA"],
  [484,"Skovlandbrug med omdriftsafgrøder","JA","-","JA"],
  [485,"Skovlandbrug med permanente afgrøder","JA","-","NEJ"],
  [486,"Hønsegård uden plantedække","-","-","JA"],
  [487,"Skovlandbrug, ikke støtteberettiget","JA","-","NEJ"],
  [488,"Hønsegård, permanent græs","JA","-","NEJ"],
  [489,"Havtorn","JA","-","NEJ"],
  [490,"Hassel, træ (Corylus avellana)","JA","-","NEJ"],
  [491,"Storfrugtet tranebær","JA","-","NEJ"],
  [492,"Tyttebær","JA","-","NEJ"],
  [493,"Surbær","JA","-","NEJ"],
  [494,"Japan kvæde","JA","-","NEJ"],
  [495,"Morbær","JA","-","NEJ"],
  [496,"Medicinplanter, vedplanter","JA","-","NEJ"],
  [497,"Planteskolekulturer, vedplanter, til videresalg","-","-","NEJ"],
  [499,"Lukket system","-","-","NEJ"],
  [501,"Stauder","-","-","JA"],
  [502,"Blomsterløg","-","-","JA"],
  [503,"Et- og toårige planter","-","-","JA"],
  [504,"Solbær, stiklingeopformering","JA","-","NEJ"],
  [505,"Ribs, stiklingeopformering","JA","-","NEJ"],
  [506,"Stikkelsbær, stiklingeopformering","JA","-","NEJ"],
  [507,"Hindbær, stiklingeopformering","JA","-","NEJ"],
  [508,"Andre af slægten Vaccinium","JA","-","NEJ"],
  [509,"Trækvæde","JA","-","NEJ"],
  [510,"Melon","-","-","JA"],
  [512,"Rabarber","-","-","NEJ"],
  [513,"Jordbær","-","-","JA"],
  [514,"Solbær","JA","-","NEJ"],
  [515,"Ribs","JA","-","NEJ"],
  [516,"Stikkelsbær","JA","-","NEJ"],
  [517,"Brombær","JA","-","NEJ"],
  [518,"Hindbær","JA","-","NEJ"],
  [519,"Blåbær","JA","-","NEJ"],
  [520,"Surkirsebær uden undervækst af græs","-","-","NEJ"],
  [521,"Surkirsebær med undervækst af græs","JA","-","NEJ"],
  [522,"Blomme uden undervækst af græs","-","-","NEJ"],
  [523,"Blomme med undervækst af græs","JA","-","NEJ"],
  [524,"Sødkirsebær uden undervækst af græs","-","-","NEJ"],
  [525,"Sødkirsebær med undervækst af græs","JA","-","NEJ"],
  [526,"Hyld","JA","-","NEJ"],
  [527,"Hassel (Corylus maxima)","JA","-","NEJ"],
  [528,"Æbler","JA","-","NEJ"],
  [529,"Pærer","JA","-","NEJ"],
  [530,"Vindrue","JA","-","NEJ"],
  [531,"Anden træfrugt","JA","-","NEJ"],
  [532,"Anden buskfrugt","JA","-","NEJ"],
  [533,"Rønnebær","JA","-","NEJ"],
  [534,"Hyben","JA","-","NEJ"],
  [535,"Bærmispel","JA","-","NEJ"],
  [536,"Spisedruer","JA","-","NEJ"],
  [537,"Valnød (almindelig)","JA","-","NEJ"],
  [538,"Kastanje (ægte)","JA","-","NEJ"],
  [539,"Blandet frugt","JA","-","NEJ"],
  [540,"Tomater","-","-","JA"],
  [541,"Agurker","-","-","JA"],
  [542,"Salat (drivhus)","-","-","JA"],
  [543,"Grøntsager, andre (drivhus)","-","-","JA"],
  [544,"Snitblomster og snitgrønt","-","-","JA"],
  [545,"Potteplanter","-","-","NEJ"],
  [547,"Planteskolekulturer, stauder","-","-","JA"],
  [548,"Småplanter, etårige","-","-","JA"],
  [551,"Moskusgræskar","-","-","JA"],
  [552,"Mandelgræskar","-","-","JA"],
  [553,"Centnergræskar","-","-","JA"],
  [563,"Svampe","-","-","NEJ"],
  [564,"Containerplads","-","-","NEJ"],
  [565,"Skovrejsning, direktivimplementerende uden tilsagn ved Landbrugsstyrelsen","JA","-","NEJ"],
  [566,"Klimaskovrejsning, national ordning, ej Landbrugsstyrelsen","JA","-","NEJ"],
  [567,"Klima-lavbundsprojekt, national ordning, ej Landbrugsstyrelsen","-","-","NEJ"],
  [570,"Humle","-","-","NEJ"],
  [575,"Skovrejsning (privat) – kulstofbinding og grundvandsbeskyttelse","JA","-","NEJ"],
  [576,"Skovrejsning (statslig) - forbedring af vandmiljø og grundvandsbeskyttelse","JA","-","NEJ"],
  [577,"Skov med biodiversitetsformål","JA","-","NEJ"],
  [578,"Skovrejsning (privat) - forbedring af vandmiljø og grundvandsbeskyttelse","JA","-","NEJ"],
  [579,"Tagetes, sygdomssanerende plante","-","-","JA"],
  [580,"Anden skovdrift","JA","-","NEJ"],
  [581,"Skovdrift med fjernelse af ved","JA","-","NEJ"],
  [582,"Pyntegrønt, økologisk jordbrug","JA","-","NEJ"],
  [583,"Juletræer og pyntegrønt","JA","-","NEJ"],
  [585,"Skovrejsning i projektområde, som ikke er omfattet af tilsagn","JA","-","NEJ"],
  [586,"Offentlig skovrejsning","JA","-","NEJ"],
  [587,"Skovrejsning på tidl. landbrugsjord 3","JA","-","NEJ"],
  [589,"Bæredygtig skovdrift","JA","-","NEJ"],
  [590,"Bæredygtig skovdrift i Natura 2000-område","JA","-","NEJ"],
  [591,"Lavskov","JA","-","NEJ"],
  [592,"Pil","JA","-","NEJ"],
  [593,"Poppel (0-100 andre træer pr. ha)","JA","-","NEJ"],
  [594,"El","JA","-","NEJ"],
  [596,"Elefantgræs","JA","-","NEJ"],
  [597,"Rørgræs","JA","-","NEJ"],
  [598,"Sorrel","-","-","JA"],
  [599,"Poppel (100-400 andre træer pr. ha)","JA","-","NEJ"],
  [650,"Chrysanthemum Garland, frø","-","-","JA"],
  [651,"Dildfrø","-","-","JA"],
  [652,"Kinesisk kålfrø","-","-","JA"],
  [653,"Karsefrø","-","-","JA"],
  [654,"Rucolafrø","-","-","JA"],
  [655,"Radisefrø (inklusive olieræddikefrø)","-","-","JA"],
  [656,"Bladbedefrø, rødbedefrø","-","-","JA"],
  [657,"Grønkålsfrø","-","-","JA"],
  [658,"Gulerodsfrø","-","-","JA"],
  [659,"Kålfrø (hvid- og rødkål)","-","-","JA"],
  [660,"Persillefrø","-","-","JA"],
  [661,"Kørvelfrø","-","-","JA"],
  [662,"Majroefrø","-","-","JA"],
  [663,"Pastinakfrø","-","-","JA"],
  [664,"Skorzonerrod/skorzonerrodfrø","-","-","JA"],
  [665,"Havrerodsfrø","-","-","JA"],
  [666,"Purløgsfrø","-","-","JA"],
  [667,"Timianfrø","-","-","JA"],
  [668,"Blomsterfrø","-","-","JA"],
  [701,"Grønkorn af vårbyg","-","-","JA"],
  [702,"Grønkorn af vårhvede","-","-","JA"],
  [703,"Grønkorn af vårhavre","-","-","JA"],
  [704,"Grønkorn af vårrug","-","-","JA"],
  [705,"Grønkorn af vårtriticale","-","-","JA"],
  [706,"Grønkorn af vinterbyg","-","-","JA"],
  [707,"Grønkorn af vinterhvede","-","-","JA"],
  [708,"Grønkorn af vinterhavre","-","-","JA"],
  [709,"Grønkorn af vinterrug","-","-","JA"],
  [710,"Grønkorn af hybridrug","-","-","JA"],
  [711,"Grønkorn af vintertriticale","-","-","JA"],
  [900,"Øvrige afgrøder","-","-","NEJ"],
  [903,"Lysåbne arealer i skov","JA","-","NEJ"],
  [907,"Naturarealer, økologisk jordbrug","JA","-","NEJ"],
]