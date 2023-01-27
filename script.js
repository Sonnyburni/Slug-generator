//Turning csv file into slugs
    console.time('time');
    const myForm = document.getElementById("myForm");
    const csvFile = document.getElementById("csvFile");
    //const fileName = document.getElementById("file").name;

    function csvToArray(str, delimiter = "|") {

      // slice from start of text to the first \n index
      // use split to create an array from string by delimiter
      const headers = str.slice(0, str.indexOf("\n")).split(delimiter);

      // slice from \n index + 1 to the end of the text
      // use split to create an array of each csv value row
      const rows = str.slice(str.indexOf("\n") + 1).split("\n");

      // Map the rows
      // split values from each row into an array
      // use headers.reduce to create an object
      // object properties derived from headers:values
      // the object passed as an element of the array
      const arr = rows.map(function (row) {
        const values = row.split(delimiter);
        console.log(values)
        const el = headers.reduce(function (object, header, index) {
          object[header] = values[index];
          return object;
        }, {});
        return el;
      });

      // return the array
      return arr;
    }
    
    //function to apply regex expressions to apply ruling to each individual section 
    function toSlug(str) {
    if (!str) return str;
    //return str.toLowerCase().replace(/( |\.)+/g, '-').replace(/[^a-zA-Z0-9-]/g, ''); // uncheck this for old naming rules on site
    return str
      .toLowerCase()
      .replace(/[\s|\.|\–|\‒|\—|\―|\_|\⁀]+/g, '-')
      .replace(/(-?[\&\+]-?)+/g, '-and-')
      .replace(/(-?[\<]-?)+/g, '-is-less-than-')
      .replace(/(-?[\=]-?)+/g, '-equals-')
      .replace(/(-?[\>]-?)+/g, '-is-greater-than-')
      .replace(/-?%-?/g, '-per-cent-')
      .replace(/-?‰-?/g, '-per-mille-')
      .replace(/-?²-?/g, '-squared-')
      .replace(/-?³-?/g, '-cubed-')
      .replace(/[àáâãäå]/g, 'a')
      .replace(/[èéêë]/g, 'e')
      .replace(/[ìíîï]/g, 'i')
      .replace(/[òóôö]/g, 'o')
      .replace(/[ùúûü]/g, 'u')
      .replace(/[ỳýŷÿ]/g, 'y')
      .replace(/[ç]/g, 'c')
      .replace(/[ñ]/g, 'n')
      .replace(/[ß]/g, 'ss')
      .replace(/[æ]/g, 'ae')
      .replace(/[œ]/g, 'oe')
      .replace(/[^a-zA-Z0-9-_\\/]/gi, '')
      .replace(/\W+$/gm,'/'); //remove of dashes and slashes at url due to empty fields e.g. /-/-/ and replacing them with trailing slashes

  }
  // once the sections have been joined with slashes this tidies them up so they appear as they do on site
  function tidy(str) {
    if (!str) return str;
    return str
     .replace(/(n\/a)/g,'-')
     .replace(/\/{3}/g, '/-/-/') // removal of some double forwards slashes
     .replace(/\/{2}/g, '/')
     .replace (/^/g,'/'); //add slashes to the start of string

  }   


    myForm.addEventListener("submit", function (e) {
      e.preventDefault(); /*Prevent default broswer behaviour of refreshing page */
      const input = csvFile.files[0];  
      const reader = new FileReader();

      reader.onload = function (e) {
        const text = e.target.result;
        const data = csvToArray(text);
        //sorts the elements of each object into the order they appear in slugs rather than order in csv giving output res
        const sortOrder = {
        'Level': 1, 
        'Subject': 2, 
        'Module': 3, 
        'Board': 4, 
        'Year': 5, 
        'Resource': 6, 
        'Section': 7, 
        'Topic': 8, 
        'Subtopic': 9, 
        'Area': 10, 
        'Subarea': 11
      }
        const res = data.map(o => Object.assign({}, ...Object.keys(o).sort((a, b) => sortOrder[a] - sortOrder[b]).map(x => { return { [x]: o[x]}})))
        //joins the elements of each 
        /*const conversion = res.map(function (element){
          return toSlug(String(Object.values(element)));
        })*/
        res.forEach(function (arrayitem) {
          Object.keys(arrayitem).forEach(key => {
            arrayitem[key] = toSlug(String(arrayitem[key]));
          });
        })
        // const conversion = Object.keys(res).forEach(key => {
        //   res[key] = toSlug(String(res[key]));
        // })
        //console.log(data);
        //console.log(res);

        const slugs = res.map(function (element){
          return tidy((Object.values(element)).join("/"));
        })

        finalSlugs = (Object.values(slugs)).join("|");
        csv = finalSlugs.toString();
        //console.log(typeof finalSlugs);
        //console.log(res);

        document.write(csv);
        var hiddenElement = document.createElement('a');
        hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
        hiddenElement.target = '_blank';
        hiddenElement.download = 'slugs.csv';
        hiddenElement.click();
        
      };
      
      reader.readAsText(input);
    });
    console.timeEnd('time');


