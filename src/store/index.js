//Redux
import { combineReducers } from "redux";

//Define All the Reducers
import adminReducer from "./Admin/admin.reducer";

import movieReducer from "./Movie/movie.reducer";
import genreReducer from "./Genre/genre.reducer";
import tagsReducer from "./Tags/tags.reducer";
import regionReducer from "./Region/region.reducer";
import trailerReducer from "./Trailer/trailer.reducer";
import teamMemberReducer from "./TeamMember/teamMember.reducer";
import userReducer from "./User/user.reducer";
import episodeReducer from "./Episode/episode.reducer";
import dashboardReducer from "./dashboard/dashboard.reducer";
import loaderReducer from "./Loader/loader.reducer";
import premiumPlanReducer from "./PremiumPlan/plan.reducer";
import faqReducer from "./Faq/faq.reducer";
import settingReducer from "./Setting/setting.reducer";
import contactReducer from "./Contact/contact.reducer";
import tvSeriesReducer from "./TvSeries/tvSeries.reducer";
import seasonReducer from "./Season/season.reducer";
import { advertiseReducer } from "./Advertisement/advertisement.reducer";
import { liveTvReducer } from "./LiveTv/liveTv.reducer";
import userRestrictedReducer from "./UserRestrictedTicket/restricted.reducer";
import languageReducer from "./Language/language.reducer";
import { TvChannelReducer } from "./TvChannel/tvChannel.reducer";
import continentRegionReducer from "./ContinentRegion/continentRegion.reducer";
import CityReducer from "./City/city.reducer";
import subtitleReducer from "./Subtitle/subtitle.reducer";
import adBannerReducer from "./AdBanner/adBanner.reducer";
import badgeReducer from "./Badge/badge.reducer";

export default combineReducers({
  admin: adminReducer,
  dashboard: dashboardReducer,
  movie: movieReducer,
  genre: genreReducer,
  tags: tagsReducer,
  language: languageReducer,
  region: regionReducer,
  continentRegion: continentRegionReducer,
  city: CityReducer,
  trailer: trailerReducer,
  subtitle: subtitleReducer,
  teamMember: teamMemberReducer,
  user: userReducer,
  episode: episodeReducer,
  loader: loaderReducer,
  premiumPlan: premiumPlanReducer,
  FaQ: faqReducer,
  setting: settingReducer,
  contact: contactReducer,
  advertisement: advertiseReducer,
  series: tvSeriesReducer,
  season: seasonReducer,
  liveTv: liveTvReducer,
  tvChannel: TvChannelReducer,
  ticketByUser: userRestrictedReducer,
  adBanner: adBannerReducer,
  badge: badgeReducer,
});
