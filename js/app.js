$(function () {
    
    /* Handles keyboard operability */
    
    $('#userInput').keypress(function (e) {

        var keycode = (e.keycode ? e.keycode : e.which);

        if (keycode == '13') submitForm(e);
        if (keycode == '16') $('#generateBtn').focus();

    });


    /* Handles form submission */
    
    $('form').submit(function (event) {
        
        submitForm(event);
        
    });

    function submitForm(event) {
        event.preventDefault();  

        var repositories;
        var allLanguages = [];
        var username = $('input[name=username]').val();
        var reqUri = 'https://api.github.com/users/' + username;
        var reposUrl = 'https://api.github.com/search/repositories?q=user:' + username +
                        '&sort=stars&order=desc';

        resetResume();

        setTimeout(function () {

            $('#generateBtn').removeClass('disabled').prop('disabled', false);

            requestJSON(reqUri, function (json) {

                /* If user not found */

                if (json.message == "Not Found" || username == '')
                    $('.no-user').slideDown(300);

                /* If user found, then display data */

                else {

                    $('.user-data').slideDown(300);

                    /* Set variables in the page */

                    $('.username').text(json.login);
                    $('.userBio').text(json.bio);
                    $('.userUrl').text(json.html_url).attr('href', json.html_url);
                    $('.repoCount').text(json.public_repos);
                    $('.fllwrCount').text(json.followers);
                    $('.year').text(json.created_at.split('-')[0]);
                    $('.city').text(json.location.split(', ')[0]);
                    if (json.location.split(', ')[1] == undefined) 
                        $('.country').text(' ');
                    else $('.country').text(', ' + json.location.split(', ')[1]);

                    /* Get all repositories */

                    $.getJSON(reposUrl, function (json, status) {

                        repositories = json.items;
                        getRepositories();
                        

                    }).fail(function () {

                       $('.no-repo').show();
                        console.log("error");
                    });
                    

                    /*
                        Get all repositores from the database
                    */
                    
                    function getRepositories() {

                        $.each(repositories, function (index) {
                            createRepository(repositories[index])
                        });
                        
                        getLanguages();
                    }

                    /*
                        Create a separate repository block
                    */
                    
                    function createRepository(repo) {

                        var lang, rights, yearFrom, yearTo, desc;

                        /* Filter data */

                        yearFrom = repo.created_at.split('-')[0];
                        yearTo = repo.updated_at.split('-')[0];

                        if (repo.language != undefined) {
                            
                            lang = repo.language;
                            allLanguages.push(lang);
                        }
                        
                        else lang = 'N/A';
                        
                        if (repo.owner.login == username) rights = "Owner";
                        else rights = "Collaborator";
                        
                        if (desc != undefined) desc = filterDesc(repo.description);
                        else desc = "";
                        
                        /* Create reposiotry container */

                        var repoContianer =
                            '<div class="repo"><div class="heading"><div class="name red">' +
                            repo.name + '</div><div class="date"><span class="from">' + 
                            yearFrom + '</span> - <span class="to">' + yearTo +
                            '</span></div></div><div class="langRights"><span class="lang">' +
                            lang + '</span> - <span class="rights">' + rights +
                            '</span></div><div class="desc">' + desc + '</div><p>This repositor' +
                            'has <span class="stars">' + repo.stargazers_count + '</span> stars and ' +
                            '<span class="forks">' + repo.forks_count + '</span> forks. If you like ' +
                            'more information about this repository and my contributed code, ' +
                            'please visit <a class="repoUrl red" href="' + repo.html_url + 
                            '" target="_blank">' + repo.html_url + '</a> on' +
                            ' GitHub.</p></div>';

                        $('.repos').append(repoContianer);
                    }
                    
                    
                    /*
                        Get all languages used
                    */
                    
                    function getLanguages() {
                                                
                        var langCount = allLanguages.length;
                        var uniqueLanguages = getUniqueLang(allLanguages);

                        $.each(uniqueLanguages, function (key, val) {
                            createLanguage(key, getPercentage(val, langCount));
                        });
                    }
                    
                    
                    /*
                        Calculates the percentage of each langauge based on the total
                        languages
                    */
                    
                    function getPercentage(count, total) {

                        return Math.floor((100 / total) * count) + "%";
                    }
                    
                    
                    /*
                        Get the different languages
                    */
                    
                    function getUniqueLang(array) {
                        
                        var uniqueLangs = {};
                        for (var i = 0; i < array.length; i++) {
                            uniqueLangs[array[i]] = 1 + (uniqueLangs[array[i]] || 0);
                        }
                        
                        return uniqueLangs;
                    }
                    

                    /*
                        Removes colons (:text:) and brackets ([UNMAINTAINED])
                    */
                    
                    function filterDesc(desc) {
                        
                        var noColons = desc.split(':');
                        var noBrackets = noColons[noColons.length-1].split('] ');
                        var filtered = noBrackets[noBrackets.length-1];
                        return filtered;
                    }
                    
                    
                    /*
                        Create a separate language block
                    */

                    function createLanguage(name, perc) {
                        
                        var langContainer =
                            '<div class="language"><div><span class="name red">' + name +
                            '</span><span class="percNum">' + perc + '</span></div><div' +
                            ' class="wrapperline"><span class="percLine"' +
                            ' style="width:' + perc + ';"><span></div></div>';
                        
                        $('.languages').append(langContainer);
                    }
                }
            });
        }, 500);
    }
    
    
    /*
        Get githib user detailes
    */
    
    function requestJSON(url, callback) {
        $.ajax({
            url: url,
            complete: function (xhr) {
                callback.call(null, xhr.responseJSON);
            }
        });
    }
    
    
    /*
        Reset the document data
    */
    
    function resetResume() {
        $('#generateBtn').addClass('disabled').prop('disabled', true);
        $('.no-user, .no-repo, .user-data').hide();
        $('.language, .repo').remove();
    }
});
