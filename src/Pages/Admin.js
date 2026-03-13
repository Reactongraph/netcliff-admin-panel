import React, { useEffect } from "react";

//router
import { Route, Switch, useHistory, useRouteMatch, Redirect } from "react-router-dom";

//component
import Navbar from "../Component/Navbar/Navbar";
import Sidebar from "../Component/Navbar/Sidebar";
import Dashboard from "../Pages/Dashboard";
import User from "../Component/Table/User";
import Region from "../Component/Table/Region";
import Genre from "../Component/Table/Genre";
import Tags from "../Component/Table/Tags";
import Movie from "../Component/Table/Movie";
import TvSeries from "../Component/Table/TvSeries";
import SeriesForm from "../Component/Dialog/SeriesForm";
import Profile from "../Pages/Profile";
import Trailer from "../Component/Table/Trailer";
import TeamMember from "../Component/Table/TeamMember";
import MovieDetails from "../Component/DetailsPage/MovieDetails";
import Episode from "../Component/Table/Episode";
import TrailerForm from "../Component/Dialog/TrailerForm";
import SeriesTrailerForm from "../Component/Dialog/SeriesTrailerForm";
import EpisodeForm from "../Component/Dialog/EpisodeForm";
import TeamMemberForm from "../Component/Dialog/TeamMemberForm";
import SeriesTeamMemberForm from "../Component/Dialog/SeriesTeamMemberForm";
import UserHistory from "../Pages/UserHistory";
import PremiumPlan from "../Component/Table/PremiumPlan";
import PurchasePremiumPlanTable from "../Component/Table/purchasePremiumPlanHistory";
import ContactUs from "../Pages/ContactUs";
import Faq from "../Pages/Faq";
import Setting from "../Pages/Setting";
import Advertisement from "./Advertisement";
import Season from "../Component/Table/Season";
import MovieDialog from "../Component/Dialog/MovieDialog";
import MovieForm from "../Component/Dialog/MovieForm";
import LiveTv from "../Component/Table/LiveTv";
import TvChannels from "../Component/Table/TvChannels";
import SeriesTrailer from "../Component/Table/SeriesTrailer";
import SeriesCast from "../Component/Table/SeriesCast";
import WebSeriesDetail from "../Component/Dialog/WebSeriesDetail";
import SeriesManual from "../Component/Dialog/SeriesManual";
import LiveTvDialogue from "../Component/Dialog/LiveTvDialogue";
import UserRaisedTicket from "../Component/Table/UserRaisedTicket";
import LiveTvForm from "../Component/Dialog/LiveTvForm";
import TvChannelForm from "../Component/Dialog/TvChannelForm";
import ContinentRegion from "../Component/Table/ContinentRegion";
import Cities from "../Component/Table/Cities";
import Subtitle from "../Component/Table/Subtitle";
import SubtitleForm from "../Component/Dialog/SubtitleForm";
import AdBannerForm from "../Component/Dialog/AdBannerForm";
import AdBanner from "../Component/Table/AdBanner";
import Analytics from "../Component/Analytics/Analytics";
import PlatformAnalytics from "../Component/Analytics/PlatformAnalytics";
import Widget from "../Component/Table/Widget";
import WidgetForm from "../Component/Dialog/WidgetForm";
import WidgetSeriesManager from "../Component/Dialog/WidgetSeriesManager";
import Banner from "../Component/Table/Banner";
import BannerForm from "../Component/Dialog/BannerForm";
import UserRecommendations from "../Component/Table/UserRecommendations";
import SubscriptionHero from "./LandingPage/SubscriptionHero";
import Badges from "./Badges";
import BrandIntegration from "../Component/Table/BrandIntegration";
import PaymentScreen from "../Component/Table/PaymentScreen";
import CustomPaymentScreen from "./CustomPaymentScreen";

const Admin = () => {
  const location = useRouteMatch();
  const history = useHistory();

  useEffect(() => {
    if (
      history.location.pathname === "/" ||
      history.location.pathname === "/admin" ||
      history.location.pathname === "" ||
      history.location.pathname === "/admin/"
    ) {
      history.push("/admin/dashboard");
    }
  }, []);

  return (
    <>
      <div id="layout-wrapper">
        <Sidebar />
        <div className="right-content">
          <Navbar />

          <Switch>
            <Route
              path={`${location.path}/dashboard`}
              exact
              component={Dashboard}
            />
            <Route exact path={`${location.path}/user`} component={User} />
            <Route
              exact
              path={`${location.path}/raisedTicket`}
              component={UserRaisedTicket}
            />
            <Route
              exact
              path={`${location.path}/user/history`}
              component={UserHistory}
            />

            <Route exact path={`${location.path}/movie`} component={Movie} />
            <Route
              exact
              path={`${location.path}/web_series`}
              component={TvSeries}
            />

            <Route
              exact
              path={`${location.path}/web_series/webSeriesDetail`}
              component={WebSeriesDetail}
            />

            <Route
              exact
              path={`${location.path}/movie/trailer`}
              component={Trailer}
            />
            <Route
              exact
              path={`${location.path}/movie/subtitle`}
              component={Subtitle}
            />
            <Route
              exact
              path={`${location.path}/web_series/trailer`}
              component={SeriesTrailer}
            />
            <Route
              exact
              path={`${location.path}/web_series/season`}
              component={Season}
            />
            <Route
              exact
              path={`${location.path}/episode`}
              component={Episode}
            />
            <Route exact path={`${location.path}/live_tv`} component={LiveTv} />

            <Route
              exact
              path={`${location.path}/tv_channels`}
              component={TvChannels}
            />

            <Route
              exact
              path={`${location.path}/tv_channels/form`}
              component={TvChannelForm}
            />

            <Route
              exact
              path={`${location.path}/live_tv/createLiveTv`}
              component={LiveTvDialogue}
            />
            <Route
              exact
              path={`${location.path}/live_tv/customLiveTv`}
              component={LiveTvForm}
            />
            <Route exact path={`${location.path}/region`} component={Region} />
            <Route
              exact
              path={`${location.path}/continent-region`}
              component={ContinentRegion}
            />
            <Route exact path={`${location.path}/badges`} component={Badges} />
            <Route exact path={`${location.path}/genre`} component={Genre} />
            <Route exact path={`${location.path}/tags`} component={Tags} />
            <Route
              exact
              path={`${location.path}/premium_plan`}
              component={PremiumPlan}
            />
            <Route
              exact
              path={`${location.path}/payment_screen`}
              component={PaymentScreen}
            />
            <Route
              exact
              path={`${location.path}/payment_screen/:id`}
              component={CustomPaymentScreen}
            />
            <Route
              exact
              path={`${location.path}/premium_plan_history`}
              component={PurchasePremiumPlanTable}
            />
            <Route
              exact
              path={`${location.path}/advertisement`}
              component={Advertisement}
            />
            <Route
              exact
              path={`${location.path}/episode/episode_form`}
              component={EpisodeForm}
            />
            <Route
              exact
              path={`${location.path}/movie/cast`}
              component={TeamMember}
            />
            <Route
              exact
              path={`${location.path}/web_series/cast`}
              component={SeriesCast}
            />
            <Route
              exact
              path={`${location.path}/cast/cast_form`}
              component={TeamMemberForm}
            />
            <Route
              exact
              path={`${location.path}/series_cast/cast_form`}
              component={SeriesTeamMemberForm}
            />
            <Route
              exact
              path={`${location.path}/profile`}
              component={Profile}
            />
            <Route
              exact
              path={`${location.path}/movie/movie_details`}
              component={MovieDetails}
            />
            <Route
              exact
              path={`${location.path}/movie/movie_form`}
              component={MovieDialog}
            />
            <Route
              exact
              path={`${location.path}/movie/movie_manual`}
              component={MovieForm}
            />

            <Route
              exact
              path={`${location.path}/web_series/series_form`}
              component={SeriesForm}
            />

            <Route
              exact
              path={`${location.path}/web_series/series_manual`}
              component={SeriesManual}
            />
            <Route
              exact
              path={`${location.path}/trailer/trailer_form`}
              component={TrailerForm}
            />
            <Route
              exact
              path={`${location.path}/subtitle/subtitle_form`}
              component={SubtitleForm}
            />
            <Route
              exact
              path={`${location.path}/series_trailer/trailer_form`}
              component={SeriesTrailerForm}
            />
            <Route
              exact
              path={`${location.path}/profile/admin_info`}
              component={Profile}
            />

            <Route
              exact
              path={`${location.path}/help_center/faq`}
              component={Faq}
            />
            <Route
              exact
              path={`${location.path}/help_center/contact_us`}
              component={ContactUs}
            />
            <Route
              exact
              path={`${location.path}/setting`}
              component={Setting}
            />
            <Route exact path={`${location.path}/cities`} component={Cities} />
            <Route
              exact
              path={`${location.path}/adbanner`}
              component={AdBanner}
            />
            <Route
              exact
              path={`${location.path}/adbanner/create`}
              component={AdBannerForm}
            />
            <Route
              exact
              path={`${location.path}/platform-analytics`}
              component={PlatformAnalytics}
            />
            <Route
              exact
              path={`${location.path}/analytics`}
              component={Analytics}
            />

            {/* Widget Routes */}
            <Route
              exact
              path={`${location.path}/widget`}
              component={Widget}
            />
            <Route
              exact
              path={`${location.path}/widget/create`}
              component={WidgetForm}
            />
            <Route
              exact
              path={`${location.path}/widget/edit/:widgetId`}
              component={WidgetForm}
            />
            <Route
              exact
              path={`${location.path}/widget/:widgetId/series`}
              component={WidgetSeriesManager}
            />

            {/* Banner Routes */}
            <Route
              exact
              path={`${location.path}/banners`}
              component={Banner}
            />
            <Route
              exact
              path={`${location.path}/add-banner`}
              component={BannerForm}
            />
            <Route
              exact
              path={`${location.path}/edit-banner/:bannerId`}
              component={BannerForm}
            />

            {/* User Recommendations Route */}
            <Route
              exact
              path={`${location.path}/user-recommendations`}
              component={UserRecommendations}
            />

            {/* Landing Page Routes */}
            <Route
              exact
              path={`${location.path}/landing-page/subscription-hero`}
              component={SubscriptionHero}
            />

            {/* Brand Integration Routes */}
            <Route
              exact
              path={`${location.path}/brand-integration`}
              component={BrandIntegration}
            />

            <Route path={`${location.path}/*`}>
              <Redirect to="/admin/dashboard" />
            </Route>
          </Switch>
        </div>

        {/* <Loader /> */}
      </div>
      {/* <div class="vertical-overlay"></div> */}
    </>
  );
};

export default Admin;
