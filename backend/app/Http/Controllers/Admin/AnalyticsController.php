<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Autoschool;
use Illuminate\Http\Request;

class AnalyticsController extends Controller
{
    public function schools(Request $request)
    {
        $granularity = $request->query('granularity', 'day');
        if (! in_array($granularity, ['day', 'week', 'month'], true)) {
            $granularity = 'day';
        }

        $rows = match ($granularity) {
            'day' => Autoschool::query()
                ->selectRaw('DATE(created_at) as period, COUNT(*) as count')
                ->whereNotNull('created_at')
                ->groupBy('period')
                ->orderBy('period')
                ->get(),
            'week' => Autoschool::query()
                ->selectRaw('YEAR(created_at) as y, WEEK(created_at, 3) as w, COUNT(*) as count')
                ->whereNotNull('created_at')
                ->groupByRaw('YEAR(created_at), WEEK(created_at, 3)')
                ->orderByRaw('YEAR(created_at), WEEK(created_at, 3)')
                ->get()
                ->map(function ($r) {
                    $r->period = $r->y.'-W'.str_pad((string) $r->w, 2, '0', STR_PAD_LEFT);
                    unset($r->y, $r->w);

                    return $r;
                }),
            'month' => Autoschool::query()
                ->selectRaw("DATE_FORMAT(created_at, '%Y-%m') as period, COUNT(*) as count")
                ->whereNotNull('created_at')
                ->groupBy('period')
                ->orderBy('period')
                ->get(),
        };

        $series = $rows->map(fn ($r) => [
            'period' => (string) $r->period,
            'count' => (int) $r->count,
        ])->values()->all();

        $trend = $this->computeTrend($series);

        return response()->json([
            'granularity' => $granularity,
            'series' => $series,
            'trend' => $trend,
            'total_schools' => Autoschool::query()->count(),
        ]);
    }

    /**
     * @param  array<int, array{period: string, count: int}>  $series
     */
    private function computeTrend(array $series): string
    {
        $n = count($series);
        if ($n === 0) {
            return 'flat';
        }
        if ($n === 1) {
            return ((int) $series[0]['count']) > 0 ? 'increasing' : 'flat';
        }

        $last = (int) $series[$n - 1]['count'];
        $prev = (int) $series[$n - 2]['count'];

        if ($last > $prev) {
            return 'increasing';
        }
        if ($last < $prev) {
            return 'decreasing';
        }

        return 'flat';
    }
}
