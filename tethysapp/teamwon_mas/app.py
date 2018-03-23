from tethys_sdk.base import TethysAppBase, url_map_maker


class TeamwonMas(TethysAppBase):
    """
    Tethys app class for Teamwond Mobility as a service.
    """

    name = 'Mobility As a Service'
    index = 'teamwon_mas:home'
    icon = 'izzatmapapp/images/icon.gif'
    package = 'teamwon_mas'
    root_url = 'teamwon-mas'
    color = '#1D63C5'
    description = 'Teamwon final application'
    tags = ''
    enable_feedback = False
    feedback_emails = []

    def url_maps(self):
        """
        Add controllers
        """
        UrlMap = url_map_maker(self.root_url)

        url_maps = (
            UrlMap(
                name='home',
                url='teamwon-mas',
                controller='teamwon_mas.controllers.home'
            ),

            UrlMap(
                name='proposal',
                url='teamwon-mas/proposal',
                controller='teamwon_mas.controllers.proposal'
            ),
        )

        return url_maps
