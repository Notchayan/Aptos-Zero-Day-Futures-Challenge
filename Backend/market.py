import numpy as np

def mean_absolute_percentage_error(y_true, y_pred):
    return np.mean(np.abs((y_true - y_pred) / y_true)) * 100

class HoltWinters:
    def __init__(self, series, slen, alpha, beta, gamma, n_preds, scaling_factor=1.96):
        """
        Args:
            series (pd.Series): initial time series
            slen (int): length of a season
            alpha (float): Holt-Winters model coefficient
            beta (float): Holt-Winters model coefficient
            gamma (float): Holt-Winters model coefficient
            n_preds (int): predictions horizon
            scaling_factor (float):  z value: sets the width of the confidence interval by Brutlag
                95% interval with scaling_factor = 1.96
                99% interval with scaling_factor = 2.576
                99.5% interval with scaling_factor = 2.807
                99.9% interval with scaling_factor = 3.291
        """
        self.series = series
        self.slen = slen
        self.alpha = alpha
        self.beta = beta
        self.gamma = gamma
        self.n_preds = n_preds
        self.scaling_factor = scaling_factor
        self.result = []
        self.upper_bond = []
        self.lower_bond = []

    def _initial_trend(self):
        sum = 0.0
        for i in range(self.slen):
            sum += float(self.series[i + self.slen] - self.series[i]) / self.slen
        return sum / self.slen

    def _initial_seasonal_components(self):
        seasonals = {}
        season_averages = []
        n_seasons = int(len(self.series) / self.slen)
        # let's calculate season averages
        for j in range(n_seasons):
            season_averages.append(sum(self.series[self.slen * j:self.slen * j + self.slen]) / float(self.slen))
        # let's calculate initial values
        for i in range(self.slen):
            sum_of_vals_over_avg = 0.0
            for j in range(n_seasons):
                sum_of_vals_over_avg += self.series[self.slen * j + i] - season_averages[j]
            seasonals[i] = sum_of_vals_over_avg / n_seasons
        return seasonals

    def triple_exponential_smoothing(self, *args, **kwargs):
        """
        Returns the triple exponential smoothing results
        Args:
            plot_results (bool): If True the results will be plotted
            *args (list): Arguments to pass to _plot_holt_winters()
            **kwargs (dict): Arguments to pass to _plot_holt_winters()

        Returns:
            list: Triple exponential smoothing results
        """
        smooth_l = []
        season_l = []
        trend_l = []
        self.predicted_deviation = []
        self.result = []
        self.upper_bond = []
        self.lower_bond = []

        seasonals = self._initial_seasonal_components()

        for i in range(len(self.series) + self.n_preds):
            if i == 0:  # components initialization
                smooth = self.series[0]
                trend = self._initial_trend()
                self.result.append(self.series[0])
                smooth_l.append(smooth)
                trend_l.append(trend)
                season_l.append(seasonals[i % self.slen])

                self.predicted_deviation.append(0)

                self.upper_bond.append(self.result[0] + self.scaling_factor * self.predicted_deviation[0])

                self.lower_bond.append(self.result[0] - self.scaling_factor * self.predicted_deviation[0])
                continue

            if i >= len(self.series):  # predicting
                m = i - len(self.series) + 1
                self.result.append((smooth + m * trend) + seasonals[i % self.slen])

                # when predicting we increase uncertainty on each step
                self.predicted_deviation.append(self.predicted_deviation[-1] * 1.01)

            else:
                val = self.series[i]
                last_smooth, smooth = smooth, self.alpha * (val - seasonals[i % self.slen]) + (1 - self.alpha) * (
                        smooth + trend)
                trend = self.beta * (smooth - last_smooth) + (1 - self.beta) * trend
                seasonals[i % self.slen] = self.gamma * (val - smooth) + (1 - self.gamma) * seasonals[i % self.slen]
                self.result.append(smooth + trend + seasonals[i % self.slen])

                # Deviation is calculated according to Brutlag algorithm.
                self.predicted_deviation.append(self.gamma * np.abs(self.series[i] - self.result[i]) +
                                           (1 - self.gamma) * self.predicted_deviation[-1])

            self.upper_bond.append(self.result[-1] + self.scaling_factor * self.predicted_deviation[-1])
            self.lower_bond.append(self.result[-1] - self.scaling_factor * self.predicted_deviation[-1])

            smooth_l.append(smooth)
            trend_l.append(trend)
            season_l.append(seasonals[i % self.slen])

        return self.result

def GetRiskStats(data=[], thresh = 0.1):
    if(len(data) < 8):
        return {"result": "not much data to predict"}

    period = 4
    model = HoltWinters(data, slen = period,
                        alpha = 0.09,
                        beta = 0,
                        gamma = 0.99,
                        n_preds = 1, scaling_factor = 3)

    model.triple_exponential_smoothing()

    result =  model.result
    # print("----Actual Data----")
    # print(data)
    # print(len(data))
    # print("----Predicted Data-----")
    # print(result[len(data):])
    # print(len(result[len(data):]))
    
    cmp = data[-1]
    pv = result[-1]
    if(pv > cmp*(1+thresh)):
        return {"result": "volatile but bullish"}
    elif(pv < cmp*(1 - thresh)):
        return {"result": "volatile but bearish"}
    elif(pv < cmp):
        return {"result": "safe and bearish"}
    elif(pv > cmp):
        return {"result": "safe and bullish"}
