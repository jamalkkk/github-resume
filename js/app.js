$(function () {

    $('#generateBtn').on('click', function (e) {
        
        e.preventDefault();

        $('#no-user, #no-repo').removeClass('active');

        var username = $('#userInput').val();
//        var username = 'andrew';

        var reqUri = 'https://api.github.com/users/' + username;
        var reposUrl = 'https://api.github.com/search/repositories?q=user:andrew&sort=stars&order=desc';

        requestJSON(reqUri, function (json) {

            /* If user not found */

            if (json.message == "Not Found" || username == '')
                $('#no-user').addClass('active');

            /* If user found, then display data */

            else {
                var fullName = json.name;
                var username = json.login;
                var userBio = json.bio;
                var userUrl = json.html_url;
                var city = json.location.split(', ')[0];
                var country = json.location.split(', ')[1];
                var yearJoined = json.created_at.split('-')[0];
                var fllwrCount = json.followers;
                var repoCount = json.public_repos;

                /* If full name not available, set full name as uername */

//                if (country == undefined) fullName = username;
                if (country == undefined) country = " ";
                else country  = ', ' + country
                /* Set variables in the page */

                $('.username').text(username);
                $('.userBio').text(userBio);
                $('.userUrl').text(userUrl).attr('href',userUrl);
                $('.repoCount').text(repoCount);
                $('.fllwrCount').text(fllwrCount);
                $('.city').text(city);
                $('.country').text(country);
                $('.year').text(yearJoined);

                /* Get all repositories */

                var repositories;
                var allLanguages = [];
                //                var uniqueLanguages

                $.getJSON(reposUrl, function (json) {
                    repositories = json.items;
                    getRepositories();
                });


                function getRepositories() {

                    if (repositories.length == 0) $('#no-repo').addClass('active');


                    else $.each(repositories, function (index) {

                        createRepository(repositories[index])
                    });

                    getLanguages();
                }


                function createRepository(repo) {

                    var rights, yearFrom, yearTo, desc;

                    /* Filter data */

                    yearFrom = repo.created_at.split('-')[0];
                    yearTo = repo.updated_at.split('-')[0];

                    if (repo.language != undefined) allLanguages.push(repo.language);

                    if (repo.owner.login == username) rights = "Owner";
                    else rights = "Collaborator";

                    /* Create reposiotry container */

                    var repoContianer =
                        '<div class="repo"><div class="heading"><div class="name">' +
                        repo.name + '</div><div class="date"><span class="from">' + yearFrom +
                        '</span> - <span class="to">' + yearTo +
                        '</span></div></div><div class="langRights"><span class="lang red">' +
                        repo.language + '</span> - <span class="rights">' + rights +
                        '</span></div><div class="desc">' + repo.description + '</div><p>This repositor' +
                        'has <span class="stars">' + repo.stargazers_count + '</span> stars and ' +
                        '<span class="forks">' + repo.forks_count + '</span> forks. If you like ' +
                        'more information about this repository and my contributed code, ' +
                        'please visit <a class="repoUrl red" href="' + repo.html_url + '" target="_blank">' + repo.html_url + '</a> on' +
                        ' GitHub.</p></div>';

                    $('.repos').append(repoContianer);
                }

                function getLanguages() {

                    var langCount = allLanguages.length;
                    var uniqueLanguages = getUniqueLang(allLanguages);

                    $.each(uniqueLanguages, function (key, val) {
                        createLanguage(key, getPercentage(val, langCount));
                    });
                }

                function getPercentage(count, total) {
                    return Math.floor((100 / total) * count) + "%";
                }

                function getUniqueLang(array) {
                    var uniqueLangs = {};
                    for (var i = 0; i < array.length; i++) {
                        uniqueLangs[array[i]] = 1 + (uniqueLangs[array[i]] || 0);
                    }
                    return uniqueLangs;
                }

                function createLanguage(name, perc) {
                    var langContainer =
                        '<div class="language"><div><span class="name red"></span>' + name +
                        ' <span class="percNum"></span>' + perc + '</div><div class="percLine"' +
                        ' style="width:' + perc + ';"></div></div>';
                    $('.languages').append(langContainer);
                }
            }

        });
    });

    function requestJSON(url, callback) {
        $.ajax({
            url: url,
            complete: function (xhr) {
                callback.call(null, xhr.responseJSON);
            }
        });
    }
});
