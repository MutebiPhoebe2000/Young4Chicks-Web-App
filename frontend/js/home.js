      const tooltips = document.querySelectorAll('.tt')
      tooltips.forEach(t => {
        new bootstrap.Tooltip(t)
      });

      document.getElementById('accordion').classList.add('red-background');