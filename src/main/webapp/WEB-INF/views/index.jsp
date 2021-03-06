<%@page contentType="text/html;charset=UTF-8"%>
<%@page pageEncoding="UTF-8"%>
<%@ page session="false"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/fmt" prefix="fmt"%>
<%@ taglib uri="http://www.springframework.org/tags/form" prefix="form"%>

<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8"/>
    <title>Weight Watcher</title>

    <!--Favourite Icon-->
    <!--<link rel="icon" type="image/x-icon" href="favicon.ico"/>-->

    <!--Page Specific Metas-->
    <meta name="description" content="Watch your weight"/>
    <meta name="author" content="Softala"/>

    <!--Mobile Specific Metas-->
    <meta name="viewport" content="width=device-width, initial-scale=1"/>

    <!--Font-->
    <!--<link href="https://fonts.googleapis.com/css?family=Open+Sans" rel="stylesheet"/>-->

    <!--Stylesheets-->
    <link href="<c:url value="/resources/css/vendor.min.css" />" rel="stylesheet"/>
    <link href="<c:url value="/resources/css/styles.min.css" />" rel="stylesheet"/>
    <style>
        /*Empty*/
    </style>
</head>

<body>
    <!--Content-->

    <header>
        <!--Navigation-->
        <nav>
            <a href="#about-section">About</a>
            <a href="#signin-section">Sign in</a>
        </nav>
    </header>

    <div id="weight-section" class="container">
        <h1>Weight Watchers <i class="fa fa-balance-scale"></i></h1>

        <form id="weight-post-form" action="weight" method="POST">
            <input type="text" name="value" value="" placeholder="Enter your weight"/>
            <select name="username">
                <!--Add the usernames dynamically-->
            </select>
            <br/>
            <input type="submit" value="Create" class="button-primary"/>
            <input type="reset" value="Reset"/>
        </form>
        <input type="checkbox" name="display-all" value="display-all"/>&nbsp;Display all the weight values<br/>

        <canvas id="weight-chart" width="600" height="400"></canvas>

        <div id="weight-list-error" class="error-box hide">Please enter a valid number e.g. 3 or 3.1</div>

        <div id="weight-list">
        </div>
    </div>

    <div id="about-section" class="container orange">
        <h2>About</h2>
        <p>The following section will most probably outline how to use the application, which as of now is pretty easy to figure out. It's a case of entering a valid number e.g. 3 or 3.1 and then choosing the "create" button.</p>
        <p><strong>Note:</strong> The application is pretty simple in design due to the initial scope of the project.</p>
    </div>

    <footer class="container">
        <h6>Made with <i class="fa fa-heart" title="... by Softala"></i> by Softala</h6>
    </footer>

    <!--Scripts-->
    <script src="<c:url value="/resources/js/vendor.min.js"/>"></script>
    <script src="<c:url value="/resources/js/scripts.min.js"/>"></script>
    <!--<script src="<c:url value="/resources/js/core.js"/>"></script>
    <script src="<c:url value="/resources/js/core.api.js"/>"></script>
    <script src="<c:url value="/resources/js/core.emitter.js"/>"></script>
    <script src="<c:url value="/resources/js/core.events.js"/>"></script>
    <script src="<c:url value="/resources/js/core.session.js"/>"></script>
    <script src="<c:url value="/resources/js/navigation.js"/>"></script>
    <script src="<c:url value="/resources/js/user.js"/>"></script>
    <script src="<c:url value="/resources/js/weight.js"/>"></script>-->
    <script>
        (function (window, $, App) {
            App.core.setIsDebug(false);
        })(window, window.jQuery, window.App);
    </script>

    <!--START: Templates-->
    <script id="template-weight-list" type="text/x-handlebars">
        {{#if this}}
            <table class="u-full-width">
                <tr>
                    <th>Id</th>
                    <th>Value</th>
                    <th>TimeStamp</th>
                    <th>ISO-8601</th>
                    <th>Username</th>
                    <th>&nbsp;</th>
                </tr>
                {{#each this}}
                    <tr>
                        <td>{{id}}</td>
                        <td>{{value}}</td>
                        <td>{{time}}</td>
                        <td>{{iso8601}}</td>
                        <td>{{username}}</td>
                        <td><input type="button" data-weight-id="{{id}}" value="Remove" title="Select to remove the following weight"/></td>
                    <tr>
                {{/each}}
            <table>
        {{else}}
            <h4>It appears no values have been entered.</h4>
        {{/if}}
    </script>

    <script id="template-user-list" type="text/x-handlebars">
        {{#if usernames}}
            <option value="" disabled selected>Choose a username</option>
            {{#each usernames}}
                <option value="{{this}}">{{this}}</option>
            {{/each}}
        {{else}}
            <option value="" disabled selected>No users were found</option>
        {{/if}}
    </script>
    <!--END: Templates-->

    <!--
        This is for testing purposes only!
        <c:if test="${empty weights}">
            No values in database.
        </c:if>
        <c:if test="${not empty weights}">
            <c:forEach var="weight" items="${weights}">
                <c:out value="${weight.id}, ${weight.value}, ${weight.time}, ${weight.username}"/>
            </c:forEach>
        </c:if>
    -->
</body>
</html>
