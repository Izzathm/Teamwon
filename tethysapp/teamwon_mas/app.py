from tethys_sdk.base import TethysAppBase, url_map_maker


class TeamwonMas(TethysAppBase):
    """
    Tethys app class for Teamwond Mobility as a service.
    """

    name = 'Mobility As a Service'
    index = 'teamwon_mas:home'
    icon = 'teamwon_mas/images/icon2.gif'
    package = 'teamwon_mas'
    root_url = 'teamwon-mas'
    color = '#1D63C5'
    description = "Get there faster, and while you're at it go for free."
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
            UrlMap(
                name='diagrams',
                url='teamwon_mas/diagrams',
                controller='teamwon_mas.controllers.diagrams'
            ),
        )


        return url_maps
